package com.wexon.software.wexon_api.modules.users.controllers;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.auth.dtos.LoginResponseDTO;
import com.wexon.software.wexon_api.modules.users.dtos.UserDTO;
import com.wexon.software.wexon_api.modules.users.dtos.UserCreateRequestDTO;
import com.wexon.software.wexon_api.modules.users.dtos.UserUpdateRequestDTO;
import com.wexon.software.wexon_api.modules.users.services.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@Tag(name ="User APIs", description = "User Related APIs")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/getCurrentUser")
    public ApiResult<LoginResponseDTO> getCurrentUser(
            Authentication authentication
    ) {
        var data = userService.getCurrentUser();
        return new ApiResult<>(
                HttpStatus.OK,
                "Current User Successfully",
                data
        );
    }

    @PostMapping("")
    public ApiResult<UserDTO> createUser(@Valid @RequestBody UserCreateRequestDTO dto) {
        var data = userService.createUser(dto);
        return new ApiResult<>(HttpStatus.CREATED, "User created successfully", data);
    }

    @PutMapping("/{id}")
    public ApiResult<UserDTO> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UserUpdateRequestDTO dto
    ) {
        var data = userService.updateUser(id, dto);
        return new ApiResult<>(HttpStatus.OK, "User updated successfully", data);
    }

    @DeleteMapping("/{id}")
    public ApiResult<String> deleteUser(@PathVariable String id) {
        var data = userService.deleteUser(id);
        return new ApiResult<>(HttpStatus.OK, "User deleted successfully", data);
    }

    @GetMapping("/{id}")
    public ApiResult<UserDTO> getUser(@PathVariable String id) {
        var data = userService.getUser(id);
        return new ApiResult<>(HttpStatus.OK, "User fetched successfully", data);
    }

    @GetMapping("/getAll")
    public ApiResult<List<UserDTO>> getUserList() {
        var data = userService.getUserList();
        return new ApiResult<>(HttpStatus.OK, "User list fetched successfully", data);
    }
}
