import sgMail from '@sendgrid/mail';
import { getEnv } from '@root/services/Configuration/env';

const API_KEY = getEnv('SENDGRID_API_KEY');
sgMail.setApiKey(API_KEY);

export default sgMail;
