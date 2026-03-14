package com.wexon.software.wexon_api.modules.users.controllers;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.users.dtos.RoleDTO;
import com.wexon.software.wexon_api.modules.users.dtos.RoleRequestDTO;
import com.wexon.software.wexon_api.modules.users.services.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@Tag(name = "Role APIs", description = "User Role Management APIs")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    public ApiResult<RoleDTO> createRole(@Valid @RequestBody RoleRequestDTO dto) {
        return new ApiResult<>(
                HttpStatus.CREATED,
                "Role created successfully",
                roleService.createRole(dto)
        );
    }

    @PutMapping("/{id}")
    public ApiResult<RoleDTO> updateRole(
            @PathVariable String id,
            @Valid @RequestBody RoleRequestDTO dto
    ) {
        return new ApiResult<>(
                HttpStatus.OK,
                "Role updated successfully",
                roleService.updateRole(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResult<String> deleteRole(@PathVariable String id) {
        return new ApiResult<>(
                HttpStatus.OK,
                "Role deleted successfully",
                roleService.deleteRole(id)
        );
    }

    @GetMapping("/{id}")
    public ApiResult<RoleDTO> getRole(@PathVariable String id) {
        return new ApiResult<>(
                HttpStatus.OK,
                "Role fetched successfully",
                roleService.getRole(id)
        );
    }

    @GetMapping("/getAll")
    public ApiResult<List<RoleDTO>> getRoles() {
        return new ApiResult<>(
                HttpStatus.OK,
                "Role list fetched successfully",
                roleService.getRoleList()
        );
    }
}
