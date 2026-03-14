package com.wexon.software.wexon_api.modules.warehouse.locations;

import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "warehouse_location")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseLocationModel extends AuditMetadata {

    @Id
    private String id;

    private String warehouseId;
    private String locationName;
    private String locationCode;

    private Boolean isActive = true;
    private Boolean isDeleted = false;
}

