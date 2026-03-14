package com.wexon.software.wexon_api.commons.responses.errorResponse;

// Java Standard Library


// Third-Party Library
import lombok.*;

// Spring Framework


// Project Specific

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiErrorResponse {
    private String timestamp;
    private Integer status;
    private String errorCode;
    private String message;
    private String path;
}
