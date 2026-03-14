package com.wexon.software.wexon_api.modules.auth.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {

    @Email(message = "Invalid Email Address.")
    @NotBlank(message = "Email is must required.")
    private String email;

    @NotBlank(message = "Password is must required.")
    private String password;

}
