import { Jobseeker } from '@typings/User';
import sgMail from './sendMail';

export default async function sendVerificationEmail(
  user: Jobseeker,
  token: string,
) {
  const msg = {
    to: user.basics.email,
    from: 'accounts@nepaljobs.cf',
    templateId: 'd-b76987e2268f4a6bb31f352165eb316d',
    dynamic_template_data: {
      siteUrl: 'https://nepaljobs.cf/',
      iconUrl: 'https://prasaya.eastus.cloudapp.azure.com/logo512.png',
      username: user.basics.firstName || 'New User',
      verifyUrl: `https://nepaljobs.cf/verify-email?token=${token}`,
    },
  };
  await sgMail.send(msg);
}
