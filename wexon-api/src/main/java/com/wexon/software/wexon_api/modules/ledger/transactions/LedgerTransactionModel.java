package com.wexon.software.wexon_api.modules.ledger.transactions;

import com.wexon.software.wexon_api.commons.enums.BalanceType;
import com.wexon.software.wexon_api.commons.enums.LedgerTransactionType;
import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "ledger_transaction")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LedgerTransactionModel extends AuditMetadata {
    @Id
    private String id;
    private String ledgerTransactionId;
    private String entityId;
    private String fromAccountId;
    private String toAccountId;
    private LedgerTransactionType ledgerTransactionType;
    private Double amount;
    private BalanceType entryType;
    private String referenceId;
    private String description;
    private LocalDate transactionDate;
    private Double closingBalance;
    private BalanceType closingBalanceType;

}
