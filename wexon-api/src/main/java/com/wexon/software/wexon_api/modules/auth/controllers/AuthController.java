package com.wexon.software.wexon_api.modules.auth.controllers;


import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.auth.dtos.LoginDTO;
import com.wexon.software.wexon_api.modules.auth.dtos.LoginResponseDTO;
import com.wexon.software.wexon_api.modules.auth.services.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name ="Auth APIs", description = "Authentication Related APIs")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResult<LoginResponseDTO> login(
            @RequestBody LoginDTO dto
    ) {
        var data = authService.login(dto);
        return new ApiResult<>(
                HttpStatus.OK,
                "Login Successfully",
                data
        );
    }

}
