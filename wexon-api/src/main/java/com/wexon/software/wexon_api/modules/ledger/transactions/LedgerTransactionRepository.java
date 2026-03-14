package com.wexon.software.wexon_api.modules.ledger.transactions;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LedgerTransactionRepository extends MongoRepository<LedgerTransactionModel, String> {
    List<LedgerTransactionModel> findByEntityIdOrderByTransactionDateDesc(String entityId);
    List<LedgerTransactionModel>
    findByEntityIdOrFromAccountIdOrToAccountIdOrderByTransactionDateDesc(
            String entityId,
            String fromAccountId,
            String toAccountId
    );
}
