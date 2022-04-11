import sgMail from '@sendgrid/mail';

const API_KEY = process.env.SENDGRID_API_KEY;
if (!API_KEY) {
  throw new Error('No SendGrid API key set!');
}
sgMail.setApiKey(API_KEY);

export default sgMail;
