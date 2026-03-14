package com.wexon.software.wexon_api.commons.exceptions.ExtendedException;

import com.wexon.software.wexon_api.commons.exceptions.BaseException;
import org.springframework.http.HttpStatus;

public class BusinessException extends BaseException {
    public BusinessException(String message, String errorCode) {
        super(message, HttpStatus.BAD_REQUEST, errorCode);
    }
}
