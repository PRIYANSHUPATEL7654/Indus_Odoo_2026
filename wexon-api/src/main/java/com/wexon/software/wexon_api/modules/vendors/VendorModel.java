package com.wexon.software.wexon_api.modules.vendors;

import com.wexon.software.wexon_api.commons.enums.VendorType;
import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "vendors")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorModel extends AuditMetadata {

    @Id
    private String id;
    private String vendorName;
    private String companyName;
    private String email;
    private String mobileNumber;
    private String gstNumber;

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
