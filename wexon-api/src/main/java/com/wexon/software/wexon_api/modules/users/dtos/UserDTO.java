package com.wexon.software.wexon_api.modules.users.dtos;

import com.wexon.software.wexon_api.modules.users.models.RoleModel;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDTO {
    private String id;
    private String email;
    private String fullName;
    private String mobileNumber;
    private Boolean enabled;
    private List<RoleModel> roles;
}
