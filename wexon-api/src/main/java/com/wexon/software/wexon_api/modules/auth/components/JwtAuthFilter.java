package com.wexon.software.wexon_api.modules.auth.components;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.responses.errorResponse.ApiErrorResponse;
import com.wexon.software.wexon_api.modules.auth.data.UserPrinciple;
import com.wexon.software.wexon_api.modules.auth.services.UserPrincipleService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserPrincipleService userPrincipleService;


    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request
    ) {

	 if ("OPTIONS".equalsIgnoreCase(request.getMethod())){
		 return true;
	 }

        return request.getServletPath().startsWith("/api/v1/auth/") ||
                request.getServletPath().startsWith("/swagger-ui") ||
                request.getServletPath().startsWith("/v3/api-docs") ||
                request.getServletPath().startsWith("/actuator") ||
                request.getServletPath().startsWith("/health") ||
                request.getServletPath().startsWith("/api/v1/public/");

    }

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {

            ApiErrorResponse error = ApiErrorResponse.builder()
                    .status(HttpStatus.UNAUTHORIZED.value())
                    .errorCode(ErrorCode.AUTH_MISSING_HEADER.code())
                    .message(ErrorCode.AUTH_MISSING_HEADER.message())
                    .path(request.getRequestURI())
                    .build();

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json");
            new ObjectMapper().writeValue(response.getOutputStream(), error);
            return;

        }

        String token = header.substring(7);

        if (!jwtProvider.verifyToken(token)) {

            ApiErrorResponse error = ApiErrorResponse.builder()
                    .status(HttpStatus.UNAUTHORIZED.value())
                    .errorCode(ErrorCode.AUTH_INVALID_TOKEN.code())
                    .message(ErrorCode.AUTH_INVALID_TOKEN.message())
                    .path(request.getRequestURI())
                    .build();

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json");
            new ObjectMapper().writeValue(response.getOutputStream(), error);
            return;

        }

        String email = jwtProvider.getUserNameFromToken(token);

        UserPrinciple userPrinciple
                = (UserPrinciple) userPrincipleService.loadUserByUsername(email);

        UsernamePasswordAuthenticationToken authenticationToken
                = new UsernamePasswordAuthenticationToken(userPrinciple, null, userPrinciple.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        filterChain.doFilter(request, response);

    }

}
