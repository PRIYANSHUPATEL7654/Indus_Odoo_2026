package com.wexon.software.wexon_api.commons.responses.successResponse;

// Java Standard Library


// Third-Party Library
import lombok.*;

// Spring Framework


// Project Specific


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private String message;
    private T data;
}
