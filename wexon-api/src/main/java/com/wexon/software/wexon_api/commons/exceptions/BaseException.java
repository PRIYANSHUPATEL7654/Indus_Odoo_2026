package com.wexon.software.wexon_api.commons.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class BaseException extends RuntimeException {

    private final String errorCode;
    private final HttpStatus httpStatus;

    public BaseException(String message, HttpStatus httpStatus, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
}
