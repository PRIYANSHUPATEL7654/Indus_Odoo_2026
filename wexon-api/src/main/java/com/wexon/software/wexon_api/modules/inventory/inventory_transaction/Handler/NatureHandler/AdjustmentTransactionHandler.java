package com.wexon.software.wexon_api.modules.inventory.inventory_transaction.Handler.NatureHandler;

import com.wexon.software.wexon_api.commons.enums.TransactionDirection;
import com.wexon.software.wexon_api.commons.enums.TransactionNature;
import com.wexon.software.wexon_api.commons.enums.TransactionStatus;
import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.Handler.TransactionHandler;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.InventoryTransaction;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.InventoryTransactionRepository;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionApproveDTO;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionCreateDTO;
import com.wexon.software.wexon_api.modules.inventory.product_inventory.ProductInventoryInternalService;
import com.wexon.software.wexon_api.modules.inventory.sequence_generator.batchNumber.BatchNoGenerator;
import com.wexon.software.wexon_api.modules.inventory.sequence_generator.transactionNumber.TransactionNoGenerator;
import com.wexon.software.wexon_api.modules.inventory.transaction_details.InventoryTransactionDetails;
import com.wexon.software.wexon_api.modules.inventory.transaction_details.InventoryTransactionDetailsRepository;
import com.wexon.software.wexon_api.modules.products.ProductModel;
import com.wexon.software.wexon_api.modules.products.ProductService;
import com.wexon.software.wexon_api.modules.warehouse.core.WarehouseInternalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AdjustmentTransactionHandler implements TransactionHandler {

    private final TransactionNoGenerator transactionNoGenerator;
    private final BatchNoGenerator batchNoGenerator;
    private final ProductService productService;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final InventoryTransactionDetailsRepository inventoryTransactionDetailsRepository;
    private final ProductInventoryInternalService productInventoryInternalService;
    private final WarehouseInternalService warehouseInternalService;

    @Override
    public TransactionNature getTransactionNature() {
        return TransactionNature.ADJUSTMENT;
    }

    @Override
    public String handleCreate(TransactionCreateDTO dto) {

        if (dto.getTransactionDate() == null) {
            dto.setTransactionDate(LocalDate.now());
        }

        if (dto.getTransactionDirection() == null) {
            throw new BusinessException(
                    ErrorCode.TRANSECTION_NATURE_NOT_VALID.message(),
                    ErrorCode.TRANSECTION_NATURE_NOT_VALID.code()
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
                TransactionNature.ADJUSTMENT,
                dto.getTransactionDirection(),
                product.getSku()
        );

        InventoryTransaction tx = new InventoryTransaction();
        tx.setTransactionNo(transactionNo);
        tx.setTransactionDate(dto.getTransactionDate());
        tx.setProductId(dto.getProductId());

        boolean affectsWarehouseQuantity = Boolean.TRUE.equals(dto.getAffectsWarehouseQuantity());
        tx.setAffectsWarehouseQuantity(affectsWarehouseQuantity);
        if (affectsWarehouseQuantity) {
            tx.setWarehouseId(dto.getWarehouseId());
        }

        tx.setRemarks(dto.getRemarks());
        tx.setTransactionNature(TransactionNature.ADJUSTMENT);
        tx.setTransactionDirection(dto.getTransactionDirection());
        tx.setStatus(TransactionStatus.CREATED);
        tx.setNetQuantity(quantity);
        tx.setNetAmountPrice(0.0);

        String id = inventoryTransactionRepository.save(tx).getId();

        InventoryTransactionDetails details = InventoryTransactionDetails.builder()
                .transactionId(id)
                .transactionNo(transactionNo)
                .batchNo(batchNoGenerator.generate())
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

        double qty = tx.getNetQuantity() != null ? tx.getNetQuantity() : 0.0;
        if (qty <= 0) {
            // fallback: adjustment quantity may not be aggregated yet; keep as 0
            qty = 0.0;
        }

        // If netQuantity not set, try reading it from the single detail we create
        if (qty == 0.0) {
            InventoryTransactionDetails txd = inventoryTransactionDetailsRepository
                    .findByTransactionId(id)
                    .stream()
                    .findFirst()
                    .orElse(null);
            if (txd != null && txd.getNetQuantity() != null) {
                qty = txd.getNetQuantity();
            }
        }

        if (tx.getTransactionDirection() == TransactionDirection.IN) {
            productInventoryInternalService.addQuantity(tx.getProductId(), qty);
        } else if (tx.getTransactionDirection() == TransactionDirection.OUT) {
            productInventoryInternalService.removeQuantity(tx.getProductId(), qty);
        }

        if (Boolean.TRUE.equals(tx.getAffectsWarehouseQuantity()) && tx.getWarehouseId() != null) {
            warehouseInternalService.updateWarehouseStock(
                    tx.getWarehouseId(),
                    qty,
                    tx.getTransactionDirection()
            );
        }

        tx.setNetQuantity(qty);
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
