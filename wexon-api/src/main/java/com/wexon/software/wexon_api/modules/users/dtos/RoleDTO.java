package com.wexon.software.wexon_api.modules.users.dtos;

import lombok.Data;

import java.util.List;

@Data
public class RoleDTO {
    private String id;
    private String roleCode;
    private String roleName;
    private String roleDescription;
    private List<FeatureDTO> features;
}
