package lk.bitproject.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import com.twilio.Twilio;
import lk.bitproject.model.SMS;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

@Component
public class SMSService {
    public static final String ACCOUNT_SID = "AC43a4d5ac81a35a4e16b436114b006c21";
    public static final String AUTH_TOKEN = "38bff19f216e222f47a88e401990ec1a";
    public static final String FROM_NUMBER = "+19164684723";

    public void send(SMS sms) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        Message message = Message.creator(new PhoneNumber(sms.getTo()), new PhoneNumber(FROM_NUMBER), sms.getMessage())
                .create();
    }

    public void receive(MultiValueMap<String, String> smscallback) {
    }
}
