package com.wexon.software.wexon_api.modules.products.dtos;

import com.wexon.software.wexon_api.commons.enums.ProductCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequestDTO {

    @NotBlank(message = "SKU is required")
    private String sku;

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 120, message = "Product name must be between 2 and 120 characters")
    private String productName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Product category is required")
    private ProductCategory category;

    @NotBlank(message = "Base unit is required")
    private String baseUnit;

    @NotNull(message = "Active status is required")
    private Boolean isActive;

}


