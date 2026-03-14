package com.wexon.software.wexon_api.modules.inventory.batch_inventory;

import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "batch_inventory")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchInventory extends AuditMetadata {

    @Id
    private String id;
    private String batchNo;
    private String transactionNo;
    private String productId;
    private Double availableQuantity;
    private Double totalQuantity;
    private Double rentalQuantity;
    private Boolean affectsWarehouseQuantity;
    private String warehouseId;

}
