const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const shortUrl = require('node-url-shortener');
const client = require('twilio')(accountSid, authToken);

export const sendSms = (phone: string, message: string) => {
  client.messages
    .create({
      body: message,
      from: phoneNumber,
      to: phone,
    })
    .then((result: any) => console.log(result));
};
