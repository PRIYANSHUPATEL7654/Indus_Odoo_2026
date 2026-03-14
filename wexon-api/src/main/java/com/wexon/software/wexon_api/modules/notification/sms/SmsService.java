package com.wexon.software.wexon_api.modules.notification.sms;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import com.wexon.software.wexon_api.modules.notification.sms.dtos.SmsRequestDTO;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SmsService {

    @Value("${twilio.account-sid}")
    String ACCOUNT_SID;

    @Value("${twilio.auth-token}")
    String AUTH_TOKEN;

    @Value("${twilio.outgoing-sms-number}")
    String OUTGOING_SMS_NUMBER;

    @PostConstruct
    private void setup(){
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    public String sendSMS(SmsRequestDTO dto){

        Message message = Message.creator(
                new PhoneNumber(dto.getSenderPhoneNumber()),
                new PhoneNumber(OUTGOING_SMS_NUMBER),
                dto.getMessage()
        ).create();

        return message.getStatus().toString();

    }
}
