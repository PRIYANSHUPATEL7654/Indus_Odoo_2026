package com.wexon.software.wexon_api.modules.notification.sms;

import com.wexon.software.wexon_api.commons.responses.successResponse.ApiResult;
import com.wexon.software.wexon_api.modules.notification.sms.dtos.SmsRequestDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notification/sms")
@RequiredArgsConstructor
@Tag(name = "SMS Notification APIs", description = "Notification Service Related APIs")
public class SmsController {

    private final SmsService smsService;

    @PostMapping("/send")
    public ApiResult<String> sendSMS(
            @RequestBody SmsRequestDTO dto
    ){
        var data = smsService.sendSMS(dto);

        return new ApiResult<>(
                HttpStatus.OK,
                "SMS Sent",
                data
        );
    }

}
