import logger from '@utils/logger';
import { User } from '@typings/User';
import { Job } from '@typings/Jobs';
import { sendSms } from '@utils/Sms';
const shortUrl = require('node-url-shortener');


export const sendNotifications = async (user: User, job: Job) => {
    try {
        let userFirstName = user.basics.firstName;
        let jobTitle = job.title;
        let userPhoneNumber = user.basics.phone;
        let jobURL = '';
        let smsURL = shortUrl.short(jobURL)

        let smsMessage = `Dear ${userFirstName}, \n.` +
            `A new job for ${jobTitle} has been posted and you matched the requirements for the job.` +
            `${smsURL}`;

        sendSms(userPhoneNumber, smsMessage);


    } catch (error) {
        logger.error('Error sending notificaton : ', error);
    };
}
