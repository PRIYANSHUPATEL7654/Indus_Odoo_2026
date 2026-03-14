package com.wexon.software.wexon_api.modules.ledger.accounts;

import com.wexon.software.wexon_api.commons.enums.BalanceType;
import com.wexon.software.wexon_api.commons.enums.EntityType;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LedgerAccountServiceImplementation implements LedgerAccountService {

    private final LedgerAccountRepository ledgerAccountRepository;

    @Override
    public void createAccount(
            String entityId,
            EntityType entityType,
            String entityName,
            String entityNumber,
            Double openingBalance,
            BalanceType openingType
    ) {

        if (ledgerAccountRepository.existsByEntityRefIdAndEntityType(entityId, entityType)) {
            throw new BusinessException(
                    "Ledger account already exists for entity",
                    "LEDGER_ACCOUNT_1001"
            );
        }

        LedgerAccountModel account = new LedgerAccountModel();
        account.setEntityRefId(entityId);
        account.setEntityType(entityType);
        account.setAccountName(entityName);
        account.setAccountNumber(entityNumber);
        account.setOpeningBalance(openingBalance);
        account.setOpeningType(openingType);
        account.setTotalDebit(0.0);
        account.setTotalCredit(0.0);
        account.setCurrentBalance(openingBalance);
        account.setBalanceType(openingType);
        account.setActive(true);

        ledgerAccountRepository.save(account);

    }

    @Override
    public void changeAccountName(
            String entityId,
            String entityName
    ) {

         var existingAccount = ledgerAccountRepository.findByEntityRefId(entityId);
         if (existingAccount == null) {
             throw new BusinessException(
                     "Ledger account not found",
                     "LEDGER_ACCOUNT_1002"
             );
         }
        existingAccount.setAccountName(entityName);
        ledgerAccountRepository.save(existingAccount);

    }

    @Override
    public LedgerAccountModel getLedgerAccountByEntityId(
            String id
    ) {
        var existingAccount = ledgerAccountRepository.findByEntityRefId(id);
        if (existingAccount == null) {
            throw new BusinessException(
                    "Ledger account not found",
                    "LEDGER_ACCOUNT_1002"
            );
        }
        return existingAccount;
    }
}
