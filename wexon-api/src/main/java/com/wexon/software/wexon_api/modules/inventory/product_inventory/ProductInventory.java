package com.wexon.software.wexon_api.modules.inventory.product_inventory;

import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "product_inventory")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductInventory extends AuditMetadata {

    @Id
    private String id;
    private String productId;
    private Double availableQuantity;
    private Double totalQuantity;
    private Double rentalQuantity;

}
