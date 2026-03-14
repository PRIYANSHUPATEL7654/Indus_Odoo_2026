package com.wexon.software.wexon_api.modules.inventory.transaction_details;

import com.wexon.software.wexon_api.commons.enums.MeasurementUnit;
import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "inventory_transaction_detail")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionDetails extends AuditMetadata {

    @Id
    private String id;
    private String transactionId;
    private String transactionNo;
    private String batchNo;
    private String vehicleNumber;
    private String locationId;

    private Double grossQuantity;
    private Double perBagLessQuantity;
    private Double debitNoteQuantity;
    private MeasurementUnit measurementUnit;
    private Integer bagQuantity;

    private Double netQuantity;
    private Double netUnitPrice;
    private String remarks;

}
