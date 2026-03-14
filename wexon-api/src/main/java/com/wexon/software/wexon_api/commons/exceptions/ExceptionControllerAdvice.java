package com.wexon.software.wexon_api.commons.exceptions;

import com.wexon.software.wexon_api.commons.responses.errorResponse.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalTime;

@RestControllerAdvice
public class ExceptionControllerAdvice {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiErrorResponse> handleBaseException(
            BaseException exception,
            HttpServletRequest request
    ) {

        ApiErrorResponse apiErrorResponse = ApiErrorResponse.builder()
                .timestamp(LocalTime.now().toString())
                .status(exception.getHttpStatus().value())
                .errorCode(exception.getErrorCode())
                .message(exception.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity
                .status(exception.getHttpStatus())
                .body(apiErrorResponse);

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnknownException(
            HttpServletRequest httpServletRequest
    ) {

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .timestamp(LocalTime.now().toString())
                .status(500)
                .errorCode("INTERNAL_SERVER_ERROR")
                .message("Internal Server Error")
                .path(httpServletRequest.getRequestURI())
                .build();

        return ResponseEntity
                .status(500)
                .body(errorResponse);

    }

}
