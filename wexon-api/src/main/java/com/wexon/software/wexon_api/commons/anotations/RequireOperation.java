package com.wexon.software.wexon_api.commons.anotations;

import com.wexon.software.wexon_api.commons.enums.UserOperations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireOperation {
    UserOperations[] value();
}
