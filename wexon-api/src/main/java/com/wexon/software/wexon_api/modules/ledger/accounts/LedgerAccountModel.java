package com.wexon.software.wexon_api.modules.ledger.accounts;

import com.wexon.software.wexon_api.commons.enums.BalanceType;
import com.wexon.software.wexon_api.commons.enums.EntityType;
import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// Note: Here Account Number is Entity Mobile Number

@Document(collection = "ledger_account")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LedgerAccountModel extends AuditMetadata {

    @Id
    private String id;

    private String entityRefId;
    private EntityType entityType;

    private String accountName;
    private String accountNumber;

    private Double openingBalance;
    private BalanceType openingType;

    private Double totalDebit;
    private Double totalCredit;
    private Double currentBalance;
    private BalanceType balanceType;

    private Boolean active;
}
