package com.wexon.software.wexon_api.modules.auth.services;

import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.UnauthorizedException;
import com.wexon.software.wexon_api.modules.auth.components.JwtProvider;
import com.wexon.software.wexon_api.modules.auth.data.UserPrinciple;
import com.wexon.software.wexon_api.modules.auth.dtos.LoginDTO;
import com.wexon.software.wexon_api.modules.auth.dtos.LoginResponseDTO;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImplementation implements AuthService {

    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    public LoginResponseDTO login(LoginDTO dto) {

        try{

            Authentication authentication
                    = authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    dto.getEmail(),
                                    dto.getPassword()));

            UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();

            if (!userPrinciple.getEnabled()) {

                throw new UnauthorizedException(
                        ErrorCode.AUTH_ACCOUNT_LOCKED.message(),
                        ErrorCode.AUTH_ACCOUNT_LOCKED.code()
                );

            }

            String token = jwtProvider.generateToken(authentication);

            return new LoginResponseDTO(
                    userPrinciple.getId(),
                    userPrinciple.getUsername(),
                    userPrinciple.getFullName(),
                    userPrinciple.getMobileNumber(),
                    token,
                    userPrinciple.getRoles()
            );

        } catch (AuthenticationException e) {

            throw new UnauthorizedException(
                    ErrorCode.AUTH_INVALID_CREDENTIALS.message(),
                    ErrorCode.AUTH_INVALID_CREDENTIALS.code()
            );

        }

    }

}
