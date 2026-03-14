package com.wexon.software.wexon_api.modules.users.services;

import com.wexon.software.wexon_api.modules.users.dtos.RoleDTO;
import com.wexon.software.wexon_api.modules.users.dtos.RoleRequestDTO;

import java.util.List;

public interface RoleService {
    RoleDTO createRole(RoleRequestDTO dto);
    RoleDTO updateRole(String id, RoleRequestDTO dto);
    String deleteRole(String id);
    RoleDTO getRole(String id);
    List<RoleDTO> getRoleList();
}