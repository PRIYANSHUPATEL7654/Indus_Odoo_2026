package com.wexon.software.wexon_api.modules.warehouse.core.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class WarehouseRequestDTO {

    @NotBlank(message = "Enter warehouse name")
    @Size(min = 3, max = 100, message = "Warehouse name must be between 3 and 100 characters")
    private String warehouseName;

    @NotBlank(message = "Enter owner name")
    @Size(min = 3, message = "Owner name must be at least 3 characters")
    private String ownerName;

    @NotBlank(message = "Enter contact number")
    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Enter a valid 10-digit mobile number")
    private String contactNumber;

    private String addressLine1;

    @Size(max = 150, message = "Address must not exceed 150 characters")
    private String addressLine2;

    @NotBlank(message = "Enter village name")
    @Size(min = 2, message = "Village name must be at least 2 characters")
    private String village;

    @NotBlank(message = "Enter taluka name")
    @Size(min = 2, message = "Taluka name must be at least 2 characters")
    private String taluka;

    @NotBlank(message = "Enter district name")
    @Size(min = 2, message = "District name must be at least 2 characters")
    private String district;

    private String city;

    @NotBlank(message = "Enter state name")
    @Size(min = 2, message = "State name must be at least 2 characters")
    private String state;

    @NotBlank(message = "Enter pincode")
    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Enter a valid 6-digit pincode")
    private String pincode;

    @NotNull(message = "Enter total capacity")
    @Positive(message = "Total capacity must be greater than 0")
    private Double totalCapacity;

    @NotNull
    private Boolean isActive;
}
