package com.wexon.software.wexon_api.modules.inventory.product_inventory;

import com.mongodb.client.result.UpdateResult;
import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductInventoryInternalService {

    private final MongoTemplate mongoTemplate;


    public void addQuantity(String productId, Double quantity) {

        Query query = new Query(Criteria.where("productId").is(productId));
        Update update = new Update()
                .inc("availableQuantity", quantity)
                .inc("totalQuantity", quantity)
                .setOnInsert("rentalQuantity", 0.0)
                .setOnInsert("productId", productId);
        mongoTemplate.upsert(query, update, ProductInventory.class);

    }


    public void removeQuantity(String productId, Double quantity) {

        Query query = new Query(
                Criteria.where("productId").is(productId)
                        .and("availableQuantity").gte(quantity)
        );
        Update update = new Update().inc("availableQuantity", -quantity);
        UpdateResult result = mongoTemplate.updateFirst(query, update, ProductInventory.class);
        if (result.getMatchedCount() == 0) {
            throw new BusinessException(
                    ErrorCode.INVENTORY_QUANTITY_INSUFFICIENT.message(),
                    ErrorCode.INVENTORY_QUANTITY_INSUFFICIENT.code()
            );
        }

    }
}
