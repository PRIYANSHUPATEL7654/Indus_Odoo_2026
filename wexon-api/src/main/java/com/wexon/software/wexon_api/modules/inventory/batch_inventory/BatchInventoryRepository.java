package com.wexon.software.wexon_api.modules.inventory.batch_inventory;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BatchInventoryRepository extends MongoRepository<BatchInventory, String> {
}
