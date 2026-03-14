package com.wexon.software.wexon_api.modules.inventory.inventory_transaction;

import com.wexon.software.wexon_api.commons.enums.PartyType;
import com.wexon.software.wexon_api.commons.enums.TransactionDirection;
import com.wexon.software.wexon_api.commons.enums.TransactionNature;
import com.wexon.software.wexon_api.commons.enums.TransactionStatus;
import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "inventory_transaction")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransaction extends AuditMetadata {

    @Id
    private String id;
    private String transactionNo;
    private LocalDate transactionDate;

    private String productId;
    private String productInventoryId;

    private TransactionNature transactionNature;
    private TransactionDirection transactionDirection;

    private Boolean affectsWarehouseQuantity;
    private String warehouseId;

    private PartyType partyType;
    private String partyId;

    private TransactionStatus status;
    private String remarks;

    private Double netQuantity;
    private Double netAmountPrice;

}
