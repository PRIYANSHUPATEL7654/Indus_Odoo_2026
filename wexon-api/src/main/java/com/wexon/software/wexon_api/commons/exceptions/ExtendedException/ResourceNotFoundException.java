package com.wexon.software.wexon_api.commons.exceptions.ExtendedException;

import com.wexon.software.wexon_api.commons.exceptions.BaseException;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BaseException {
    public ResourceNotFoundException(String message, String errorCode) {
        super(message, HttpStatus.NOT_FOUND, errorCode);
    }
}
