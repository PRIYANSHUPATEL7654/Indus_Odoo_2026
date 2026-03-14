package com.wexon.software.wexon_api.commons.responses.successResponse;

// Java Standard Library


// Third-Party Library
import lombok.*;

// Spring Framework
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// Project Specific


@Getter
@Setter
public class ApiResult<T> extends ResponseEntity<ApiResponse<T>> {
    public ApiResult(HttpStatus status, String message, T data) {
        super(new ApiResponse<>(message, data), status);
    }
}
