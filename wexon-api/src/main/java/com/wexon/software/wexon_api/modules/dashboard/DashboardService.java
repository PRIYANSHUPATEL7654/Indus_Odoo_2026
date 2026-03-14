package com.wexon.software.wexon_api.modules.dashboard;

import com.wexon.software.wexon_api.commons.enums.TransactionNature;
import com.wexon.software.wexon_api.commons.enums.TransactionStatus;
import com.wexon.software.wexon_api.modules.dashboard.dto.DashboardKpiDTO;
import com.wexon.software.wexon_api.modules.inventory.inventory_transaction.InventoryTransaction;
import com.wexon.software.wexon_api.modules.inventory.product_inventory.ProductInventory;
import com.wexon.software.wexon_api.modules.products.ProductModel;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final double DEFAULT_LOW_STOCK_THRESHOLD = 10.0;

    private final MongoTemplate mongoTemplate;

    public DashboardKpiDTO getKpis() {

        long totalProducts = mongoTemplate.count(
                Query.query(Criteria.where("isDeleted").is(false)),
                ProductModel.class
        );

        long distinctProductsInStock = mongoTemplate.count(
                Query.query(Criteria.where("availableQuantity").gt(0)),
                ProductInventory.class
        );

        double totalAvailableStockQuantity = sumDoubleField(ProductInventory.class, "availableQuantity");

        long outOfStockItems = mongoTemplate.count(
                Query.query(Criteria.where("availableQuantity").lte(0)),
                ProductInventory.class
        );

        long lowStockItems = mongoTemplate.count(
                Query.query(
                        Criteria.where("availableQuantity").gt(0).lte(DEFAULT_LOW_STOCK_THRESHOLD)
                ),
                ProductInventory.class
        );

        long pendingReceipts = countPending(TransactionNature.BUY);
        long pendingDeliveries = countPending(TransactionNature.SELL);
        long internalTransfersScheduled = countPending(TransactionNature.TRANSFER);
        long pendingAdjustments = countPending(TransactionNature.ADJUSTMENT);

        return DashboardKpiDTO.builder()
                .totalProducts(totalProducts)
                .distinctProductsInStock(distinctProductsInStock)
                .totalAvailableStockQuantity(totalAvailableStockQuantity)
                .lowStockItems(lowStockItems)
                .outOfStockItems(outOfStockItems)
                .pendingReceipts(pendingReceipts)
                .pendingDeliveries(pendingDeliveries)
                .internalTransfersScheduled(internalTransfersScheduled)
                .pendingAdjustments(pendingAdjustments)
                .build();
    }

    private long countPending(TransactionNature nature) {
        return mongoTemplate.count(
                Query.query(
                        Criteria.where("transactionNature").is(nature)
                                .and("status").is(TransactionStatus.CREATED)
                ),
                InventoryTransaction.class
        );
    }

    private <T> double sumDoubleField(Class<T> collectionType, String field) {
        GroupOperation group = Aggregation.group().sum(field).as("sum");
        Aggregation agg = Aggregation.newAggregation(group);
        AggregationResults<SumResult> results = mongoTemplate.aggregate(agg, collectionType, SumResult.class);
        SumResult res = results.getUniqueMappedResult();
        return res != null && res.sum != null ? res.sum : 0.0;
    }

    private static class SumResult {
        public Double sum;
    }
}

