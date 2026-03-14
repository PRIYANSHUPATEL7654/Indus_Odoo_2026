package com.wexon.software.wexon_api.modules.products;

import com.wexon.software.wexon_api.commons.enums.ProductCategory;
import com.wexon.software.wexon_api.modules.audit.AuditMetadata;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "product")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductModel extends AuditMetadata {
    @Id
    private String id;

    @NotBlank(message = "SKU is required")
    private String sku;
    @NotBlank(message = "Product Name is required")
    private String productName;
    private String description;
    private ProductCategory category;
    private String baseUnit;
    private Boolean isActive = true;
    private Boolean isDeleted = false;
}
