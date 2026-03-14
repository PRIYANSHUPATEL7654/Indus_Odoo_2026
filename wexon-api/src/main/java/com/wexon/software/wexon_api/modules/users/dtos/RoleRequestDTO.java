package com.wexon.software.wexon_api.modules.users.dtos;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class RoleRequestDTO {
    @NotBlank(message = "Role code is required")
    private String roleCode;
    @NotBlank(message = "Role name is required")
    private String roleName;
    private String roleDescription;
    private List<FeatureDTO> features;
}
