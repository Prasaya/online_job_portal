const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

export const sendSms = (phone, message) => {
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
            body: message,
            from: phoneNumber,
            to: phone
        })
        .then(message => console.log(message));
}

