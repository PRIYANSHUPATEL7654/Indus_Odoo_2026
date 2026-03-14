package com.wexon.software.wexon_api.modules.warehouse.locations.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class WarehouseLocationRequestDTO {

    @NotBlank(message = "Warehouse is required")
    private String warehouseId;

    @NotBlank(message = "Location name is required")
    @Size(min = 2, max = 120, message = "Location name must be between 2 and 120 characters")
    private String locationName;

    @NotBlank(message = "Location code is required")
    @Size(min = 2, max = 32, message = "Location code must be between 2 and 32 characters")
    private String locationCode;

    private Boolean isActive = true;
}

