package com.wexon.software.wexon_api.commons.exceptions.ExtendedException;


import com.wexon.software.wexon_api.commons.exceptions.BaseException;
import org.springframework.http.HttpStatus;

public class UnauthorizedException extends BaseException {
    public UnauthorizedException(String message, String errorCode) {
        super(message, HttpStatus.UNAUTHORIZED, errorCode);
    }
}