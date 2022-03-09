import { getOrganizationById } from '@models/Organization';
import JobPost from '@typings/JobPost';
import DBJob from '@typings/Jobs';
import { User } from '@typings/User';
import Connection from 'mysql2/typings/mysql/lib/Connection';
import sgMail from './sendMail';

// TODO: change templateId and dynamic_template_data according to template
export default async function sendNotificationEmail(user: User, job: DBJob) {
    let companyDetails = (await getOrganizationById(job.companyId))[0];

    const msg = {
        to: user.basics.email,
        from: 'accounts@nepaljobs.cf',
        templateId: 'd-e2b989853677487482ebcfb8fe24b075',
        dynamic_template_data: {
            siteUrl: 'http://prasaya.eastus.cloudapp.azure.com/',
            iconUrl: 'https://prasaya.eastus.cloudapp.azure.com/logo512.png',
            username: user.basics.firstName || 'New User',
            jobTitle: job.title,
            companyName: companyDetails.name,
            jobUrl: `http://nepaljobs.cf/jobs/${job.jobId}}?from=email&applicantId=${user.basics.id}`,
        },
    };

    await sgMail.send(msg);
}
