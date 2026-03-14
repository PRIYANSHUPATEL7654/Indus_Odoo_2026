package com.wexon.software.wexon_api.modules.auth.dtos;

import com.wexon.software.wexon_api.modules.users.models.RoleModel;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String id;
    private String email;
    private String fullName;
    private String mobileNumber;
    private String token;
    private List<RoleModel> roles;
}
