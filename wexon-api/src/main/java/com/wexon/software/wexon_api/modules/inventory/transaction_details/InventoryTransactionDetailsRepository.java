package com.wexon.software.wexon_api.modules.inventory.transaction_details;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface InventoryTransactionDetailsRepository extends MongoRepository<InventoryTransactionDetails, String> {
    List<InventoryTransactionDetails> findByTransactionId(String transactionId);
}
