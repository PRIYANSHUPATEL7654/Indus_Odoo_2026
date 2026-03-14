package com.wexon.software.wexon_api.modules.ledger.transactions;

import java.util.List;

public interface LedgerTransactionService {

    List<LedgerTransactionModel> getLedgerTransactionByEntityId(String id);
}
