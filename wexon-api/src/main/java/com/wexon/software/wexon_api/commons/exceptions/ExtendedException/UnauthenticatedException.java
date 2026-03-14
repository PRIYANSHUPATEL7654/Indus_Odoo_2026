package com.wexon.software.wexon_api.commons.exceptions.ExtendedException;

import com.wexon.software.wexon_api.commons.exceptions.BaseException;
import org.springframework.http.HttpStatus;

public class UnauthenticatedException extends BaseException {
    public UnauthenticatedException(String message, String errorCode) {
        super(message, HttpStatus.FORBIDDEN, errorCode);
    }
}