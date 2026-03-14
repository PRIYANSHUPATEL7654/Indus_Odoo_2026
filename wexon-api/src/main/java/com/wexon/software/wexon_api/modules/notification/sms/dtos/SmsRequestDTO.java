package com.wexon.software.wexon_api.modules.notification.sms.dtos;


import lombok.Data;

@Data
public class SmsRequestDTO {
    private String senderPhoneNumber;
    private String message;
}
