package com.wexon.software.wexon_api.modules.users.dtos;

import com.wexon.software.wexon_api.modules.users.models.RoleModel;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
public class UserDTOForUserPrinciple{
    private String id;
    private String email;
    private String password;
    private String fullName;
    private String mobileNumber;
    private List<RoleModel> roles;
    private Boolean enabled;
    private Boolean accountNonExpired;
    private Boolean credentialsNonExpired;
    private Boolean accountNonLocked;
}
