package com.wexon.software.wexon_api.modules.ledger.transactions;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LedgerTransactionServiceImplementation implements LedgerTransactionService {

    private final LedgerTransactionRepository ledgerTransactionRepository;

    @Override
    public List<LedgerTransactionModel> getLedgerTransactionByEntityId(String id) {

        return ledgerTransactionRepository
                .findByEntityIdOrFromAccountIdOrToAccountIdOrderByTransactionDateDesc(
                        id,
                        id,
                        id
                );
    }
}