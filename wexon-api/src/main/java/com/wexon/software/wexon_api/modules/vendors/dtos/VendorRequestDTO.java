package com.wexon.software.wexon_api.modules.vendors.dtos;

import com.wexon.software.wexon_api.commons.enums.VendorType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorRequestDTO {

    @NotBlank(message = "Vendor name is required")
    @Size(min = 2, max = 80, message = "Vendor name must be between 2 and 80 characters")
    private String vendorName;

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 120, message = "Company name must be between 2 and 120 characters")
    private String companyName;

    @Email(message = "Invalid email format")
    @Size(max = 120, message = "Email cannot exceed 120 characters")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Mobile number must be a valid 10-digit number"
    )
    private String mobileNumber;

    @Size(max = 20, message = "GST number must not exceed 20 characters")
    private String gstNumber;

    @NotBlank(message = "Address line 1 is required")
    @Size(min = 5, max = 150, message = "Address line 1 must be between 5 and 150 characters")
    private String addressLine1;

    @Size(max = 150, message = "Address line 2 cannot exceed 150 characters")
    private String addressLine2;

    @NotBlank(message = "Village is required")
    @Size(min = 2, max = 100, message = "Village must be between 2 and 100 characters")
    private String village;

    @NotBlank(message = "Taluka is required")
    @Size(min = 2, max = 100, message = "Taluka must be between 2 and 100 characters")
    private String taluka;

    @NotBlank(message = "District is required")
    @Size(min = 2, max = 100, message = "District must be between 2 and 100 characters")
    private String district;

    @Size(min = 2, max = 100, message = "City must be between 2 and 100 characters")
    private String city;

    @NotBlank(message = "State is required")
    @Size(min = 2, max = 100, message = "State must be between 2 and 100 characters")
    private String state;

    @NotBlank(message = "Pincode is required")
    @Pattern(
            regexp = "^[1-9][0-9]{5}$",
            message = "Pincode must be a valid 6-digit Indian pincode"
    )
    private String pincode;

    @NotNull
    private Boolean isActive;
}
