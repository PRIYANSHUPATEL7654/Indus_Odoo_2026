package com.wexon.software.wexon_api.modules.auth.services;

import com.wexon.software.wexon_api.modules.auth.dtos.LoginDTO;
import com.wexon.software.wexon_api.modules.auth.dtos.LoginResponseDTO;
import org.springframework.security.core.Authentication;

public interface AuthService {
    LoginResponseDTO login(LoginDTO dto);
}
