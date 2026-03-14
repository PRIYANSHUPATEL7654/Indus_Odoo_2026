package com.wexon.software.wexon_api.modules.inventory.inventory_transaction.Handler.NatureHandler;

import com.wexon.software.wexon_api.commons.enums.TransactionDirection;
import com.wexon.software.wexon_api.commons.enums.TransactionNature;
import com.wexon.software.wexon_api.commons.enums.TransactionStatus;
import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import com.wexon.software.wexon_api.modules.inventory.batch_inventory.BatchInventory;
import com.wexon.software.wexon_api.modules.inventory.batch_inventory.BatchInventoryService;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.Handler.TransactionHandler;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.InventoryTransaction;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.InventoryTransactionRepository;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionApproveDTO;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionCreateDTO;
import com.wexon.software.wexon_api.modules.inventory.sequence_generator.batchNumber.BatchNoGenerator;
import com.wexon.software.wexon_api.modules.inventory.sequence_generator.transactionNumber.TransactionNoGenerator;
import com.wexon.software.wexon_api.modules.inventory.transaction_details.InventoryTransactionDetails;
import com.wexon.software.wexon_api.modules.inventory.transaction_details.InventoryTransactionDetailsRepository;
import com.wexon.software.wexon_api.modules.products.ProductModel;
import com.wexon.software.wexon_api.modules.products.ProductService;
import com.wexon.software.wexon_api.modules.warehouse.core.WarehouseInternalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransferTransactionHandler implements TransactionHandler {

    private final TransactionNoGenerator transactionNoGenerator;
    private final BatchNoGenerator batchNoGenerator;
    private final ProductService productService;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final InventoryTransactionDetailsRepository inventoryTransactionDetailsRepository;
    private final BatchInventoryService batchInventoryService;
    private final WarehouseInternalService warehouseInternalService;
    private final MongoTemplate mongoTemplate;

    @Override
    public TransactionNature getTransactionNature() {
        return TransactionNature.TRANSFER;
    }

    @Override
    public String handleCreate(TransactionCreateDTO dto) {

        if (dto.getTransactionDate() == null) {
            dto.setTransactionDate(LocalDate.now());
        }

        if (dto.getProductId() == null || dto.getProductId().isBlank()) {
            throw new BusinessException(
                    ErrorCode.PRODUCT_NOT_FOUND.message(),
                    ErrorCode.PRODUCT_NOT_FOUND.code()
            );
        }

        if (dto.getBatchNo() == null || dto.getBatchNo().isBlank()) {
            throw new BusinessException(
                    ErrorCode.INVENTORY_BATCH_NOT_FOUND.message(),
                    ErrorCode.INVENTORY_BATCH_NOT_FOUND.code()
            );
        }

        if (dto.getWarehouseId() == null || dto.getWarehouseId().isBlank()) {
            throw new BusinessException(
                    ErrorCode.WAREHOUSE_NOT_FOUND.message(),
                    ErrorCode.WAREHOUSE_NOT_FOUND.code()
            );
        }

        Double quantity = dto.getQuantity() != null ? dto.getQuantity() : 0.0;
        if (quantity <= 0) {
            throw new BusinessException(
                    ErrorCode.INVENTORY_QUANTITY_INSUFFICIENT.message(),
                    ErrorCode.INVENTORY_QUANTITY_INSUFFICIENT.code()
            );
        }

        ProductModel product = productService.getProduct(dto.getProductId());

        String transactionNo = transactionNoGenerator.generate(
                dto.getTransactionDate(),
                TransactionNature.TRANSFER,
                TransactionDirection.OUT,
                product.getSku()
        );

        InventoryTransaction tx = new InventoryTransaction();
        tx.setTransactionNo(transactionNo);
        tx.setTransactionDate(dto.getTransactionDate());
        tx.setProductId(dto.getProductId());

        tx.setAffectsWarehouseQuantity(true);
        // For transfer: store destination warehouseId on the transaction
        tx.setWarehouseId(dto.getWarehouseId());

        tx.setRemarks(dto.getRemarks());
        tx.setTransactionNature(TransactionNature.TRANSFER);
        tx.setTransactionDirection(TransactionDirection.OUT);
        tx.setStatus(TransactionStatus.CREATED);
        tx.setNetQuantity(quantity);
        tx.setNetAmountPrice(0.0);

        String id = inventoryTransactionRepository.save(tx).getId();

        InventoryTransactionDetails details = InventoryTransactionDetails.builder()
                .transactionId(id)
                .transactionNo(transactionNo)
                .batchNo(dto.getBatchNo())
                .grossQuantity(quantity)
                .netQuantity(quantity)
                .netUnitPrice(0.0)
                .remarks(dto.getRemarks())
                .build();

        inventoryTransactionDetailsRepository.save(details);

        return id;
    }

    @Override
    public String handleApproved(String id, TransactionApproveDTO dto) {

        InventoryTransaction tx = inventoryTransactionRepository.findById(id).orElseThrow(
                () -> new BusinessException(
                        ErrorCode.INVENTORY_TRANSECTION_NOT_FOUND.message(),
                        ErrorCode.INVENTORY_TRANSECTION_NOT_FOUND.code()
                )
        );

        if (tx.getStatus() != TransactionStatus.CREATED) {
            throw new BusinessException(
                    ErrorCode.INVENTORY_TRANSACTION_APPROVE_NOT_ALLOWED.message(),
                    ErrorCode.INVENTORY_TRANSACTION_APPROVE_NOT_ALLOWED.code()
            );
        }

        Query query = new Query(Criteria.where("transactionId").is(tx.getId()));
        List<InventoryTransactionDetails> txdList = mongoTemplate.find(query, InventoryTransactionDetails.class);

        if (txdList.isEmpty()) {
            throw new BusinessException(
                    ErrorCode.INVENTORY_TRANSECTION_DETAIL_NOT_FOUND.message(),
                    ErrorCode.INVENTORY_TRANSECTION_DETAIL_NOT_FOUND.code()
            );
        }

        double totalNetQuantity = 0.0;

        for (InventoryTransactionDetails txd : txdList) {
            double qty = txd.getNetQuantity() != null ? txd.getNetQuantity() : 0.0;
            totalNetQuantity += qty;

            BatchInventory sourceBatch = batchInventoryService.reduceQuantity(txd.getBatchNo(), qty);

            // Update source warehouse capacity OUT (if applicable)
            if (Boolean.TRUE.equals(sourceBatch.getAffectsWarehouseQuantity()) && sourceBatch.getWarehouseId() != null) {
                warehouseInternalService.updateWarehouseStock(
                        sourceBatch.getWarehouseId(),
                        qty,
                        TransactionDirection.OUT
                );
            }

            // Create destination batch in destination warehouse (warehouseId stored on tx)
            String destBatchNo = batchNoGenerator.generate();
            batchInventoryService.createBatchInventory(
                    destBatchNo,
                    tx.getTransactionNo(),
                    sourceBatch.getProductId(),
                    qty,
                    qty,
                    0.0,
                    true,
                    tx.getWarehouseId()
            );

            warehouseInternalService.updateWarehouseStock(
                    tx.getWarehouseId(),
                    qty,
                    TransactionDirection.IN
            );
        }

        tx.setNetQuantity(totalNetQuantity);
        tx.setNetAmountPrice(0.0);
        tx.setStatus(TransactionStatus.APPROVED);
        inventoryTransactionRepository.save(tx);

        return id;
    }

    @Override
    public void handlePosted() { }

    @Override
    public void handleCanceled() { }
}
