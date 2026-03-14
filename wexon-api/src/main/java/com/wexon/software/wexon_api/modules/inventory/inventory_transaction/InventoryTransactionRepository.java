package com.wexon.software.wexon_api.modules.inventory.inventory_transaction;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface InventoryTransactionRepository extends MongoRepository<InventoryTransaction, String> {
}
