import logger from '@utils/logger';
import { User } from '@typings/User';
import { Job } from '@typings/Jobs';
import { sendSms } from '@utils/Sms';
import sendNotificationEmail from '@utils/notificationEmail';
import { getJobById } from './Jobs';
import { getUserById } from './User';
const shortUrl = require('node-url-shortener');


export const sendNotifications = async (userId: string, jobId: string) => {
    try {

        let job = await getJobById(jobId);

        let user = await getUserById(userId);

        sendNotificationEmail(user, job);

        let userFirstName = user.basics.firstName;
        let jobTitle = job.title;
        let userPhoneNumber = user.basics.phone;
        if (!userPhoneNumber) {
            return { status: 400, message: 'User has no phone number', success: false };
        }

        let jobURL = `http://prasaya.eastus.cloudapp.azure.com/job/${job.jobId}`;
        let smsURL = "";
        shortUrl.short(jobURL, function (err, url) {
            smsURL = url;
            let smsMessage = `Dear ${userFirstName}, \n` +
                `A new job for ${jobTitle} has been posted and you matched the requirements for the job.\n` +
                `${smsURL}`;
            console.log(smsMessage);
            console.log(userPhoneNumber);
            sendSms(userPhoneNumber, smsMessage);
        });
    } catch (error) {
        logger.error('Error sending notificaton : ', error);
    };
}
