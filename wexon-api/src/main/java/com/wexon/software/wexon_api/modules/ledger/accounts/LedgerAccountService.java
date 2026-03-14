package com.wexon.software.wexon_api.modules.ledger.accounts;

import com.wexon.software.wexon_api.commons.enums.BalanceType;
import com.wexon.software.wexon_api.commons.enums.EntityType;

public interface LedgerAccountService {

    void createAccount(
            String entityId,
            EntityType entityType,
            String entityName,
            String entityNumber,
            Double openingBalance,
            BalanceType openingType
    );

    void changeAccountName(
            String entityId,
            String entityName
    );

    LedgerAccountModel getLedgerAccountByEntityId(String id);

}
