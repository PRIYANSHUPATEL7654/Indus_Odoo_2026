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
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.dto.TransactionTotalsDTO;
import com.wexon.software.wexon_api.modules.inventory.product_inventory.ProductInventoryInternalService;
import com.wexon.software.wexon_api.modules.inventory.sequence_generator.transactionNumber.TransactionNoGenerator;
import com.wexon.software.wexon_api.modules.inventory.transaction_details.InventoryTransactionDetails;
import com.wexon.software.wexon_api.modules.inventory.transaction_details.InventoryTransactionDetailsRepository;
import com.wexon.software.wexon_api.modules.products.ProductModel;
import com.wexon.software.wexon_api.modules.products.ProductService;
import com.wexon.software.wexon_api.modules.warehouse.core.WarehouseInternalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SellTransactionHandler implements TransactionHandler {

    private final TransactionNoGenerator transactionNoGenerator;
    private final ProductService productService;
    private final InventoryTransactionRepository inventoryTransactionRepository;
                    private final MongoTemplate mongoTemplate;
    private final InventoryTransactionDetailsRepository inventoryTransactionDetailsRepository;
    private final BatchInventoryService batchInventoryService;
    private final ProductInventoryInternalService productInventoryInternalService;
    private final WarehouseInternalService warehouseInternalService;


    @Override
    public TransactionNature getTransactionNature() {
        return TransactionNature.SELL;
    }

    @Override
    public String handleCreate(TransactionCreateDTO dto) {

        if (dto.getTransactionDate() == null) {
            dto.setTransactionDate(LocalDate.now());
        }

        if (dto.getBatchNo() == null || dto.getBatchNo().isBlank()) {
            throw new BusinessException(
                    ErrorCode.INVENTORY_BATCH_NOT_FOUND.message(),
                    ErrorCode.INVENTORY_BATCH_NOT_FOUND.code()
            );
        }

        ProductModel product = productService.getProduct(dto.getProductId());

        String transactionNo = transactionNoGenerator.generate(
                dto.getTransactionDate(),
                dto.getTransactionNature(),
                TransactionDirection.OUT,
                product.getSku()
        );

        InventoryTransaction tx = new InventoryTransaction();
        tx.setTransactionNo(transactionNo);
        tx.setTransactionDate(dto.getTransactionDate());
        tx.setProductId(dto.getProductId());

        tx.setPartyType(dto.getPartyType());
        tx.setPartyId(dto.getPartyId());
        tx.setRemarks(dto.getRemarks());

        tx.setTransactionNature(TransactionNature.SELL);
        tx.setTransactionDirection(TransactionDirection.OUT);
        tx.setStatus(TransactionStatus.CREATED);

        String id = inventoryTransactionRepository.save(tx).getId();

        Double quantity = dto.getQuantity() != null ? dto.getQuantity() : 0.0;
        Double unitPrice = dto.getUnitPrice() != null ? dto.getUnitPrice() : 0.0;

        InventoryTransactionDetails details = InventoryTransactionDetails.builder()
                .transactionId(id)
                .transactionNo(transactionNo)
                .batchNo(dto.getBatchNo())
                .vehicleNumber(dto.getVehicleNumber())
                .grossQuantity(quantity)
                .netQuantity(quantity)
                .netUnitPrice(unitPrice)
                .bagQuantity(dto.getBagQuantity())
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

        // Find Total Weight and Amount
        MatchOperation match = Aggregation.match(Criteria.where("transactionId").is(id));
        ProjectionOperation project = Aggregation.project()
                .and("netQuantity").as("netQuantity")
                .and(ArithmeticOperators.Multiply.valueOf("netQuantity")
                        .multiplyBy("netUnitPrice")).as("netAmount");

        GroupOperation group = Aggregation.group()
                .sum("netQuantity").as("totalNetQuantity")
                .sum("netAmount").as("totalNetAmountPrice");

        Aggregation aggregation = Aggregation.newAggregation(
                match,
                project,
                group
        );
        AggregationResults<TransactionTotalsDTO> results =
                mongoTemplate.aggregate(
                        aggregation,
                        InventoryTransactionDetails.class,
                        TransactionTotalsDTO.class
                );
        TransactionTotalsDTO totals = results.getUniqueMappedResult();
        double totalNetQuantity
                = totals != null && totals.getTotalNetQuantity() != null
                ? totals.getTotalNetQuantity()
                : 0.0;
        double totalNetAmountPrice
                = totals != null && totals.getTotalNetAmountPrice() != null
                ? totals.getTotalNetAmountPrice()
                : 0.0;


        tx.setNetQuantity(totalNetQuantity);
        tx.setNetAmountPrice(totalNetAmountPrice);

        productInventoryInternalService.removeQuantity(tx.getProductId(), totalNetQuantity);

        Query query = new Query(Criteria.where("transactionId").is(tx.getId()));
        List<InventoryTransactionDetails> txdList = mongoTemplate.find(query, InventoryTransactionDetails.class);

        if( txdList.isEmpty() ) {
            throw new BusinessException(
                    ErrorCode.INVENTORY_TRANSECTION_DETAIL_NOT_FOUND.message(),
                    ErrorCode.INVENTORY_TRANSECTION_DETAIL_NOT_FOUND.code()
            );
        }

        for (InventoryTransactionDetails txd : txdList) {

            BatchInventory batchInventory = batchInventoryService.reduceQuantity(txd.getBatchNo(), txd.getGrossQuantity());

            if (batchInventory.getAffectsWarehouseQuantity()) {
                warehouseInternalService.updateWarehouseStock(
                        batchInventory.getWarehouseId(),
                        txd.getNetQuantity(),
                        TransactionDirection.OUT
                );
            }

        }

        tx.setStatus(TransactionStatus.APPROVED);
        inventoryTransactionRepository.save(tx);

        return id;
    }

    @Override
    public void handlePosted() {

    }

    @Override
    public void handleCanceled() {

    }
}
