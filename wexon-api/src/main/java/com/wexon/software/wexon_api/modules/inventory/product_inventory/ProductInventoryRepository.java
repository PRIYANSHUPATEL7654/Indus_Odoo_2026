package com.wexon.software.wexon_api.modules.inventory.product_inventory;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


public interface ProductInventoryRepository extends MongoRepository<ProductInventory, String> {
}
