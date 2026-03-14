package com.wexon.software.wexon_api.modules.warehouse.core;

import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "warehouse")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseModel extends AuditMetadata {

    @Id
    private String id;

    private String warehouseName;
    private String warehouseCode;

    private String ownerName;
    private String contactNumber;

    private Double totalCapacity;
    private Double availableCapacity;
    private Double usedCapacity;

    private String addressLine1;
    private String addressLine2;

    private String village;
    private String taluka;

    private String district;
    private String city;
    private String state;
    private String pincode;

    private Boolean isActive = true;
    private Boolean isDeleted = false;

}
