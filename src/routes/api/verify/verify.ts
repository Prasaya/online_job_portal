import express, { Request, Response } from 'express';
import { param, validationResult, checkSchema } from 'express-validator';
import connection from '@utils/dbSetup';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { isApplicant } from '@middleware/authorization';
import { randomUUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import sendVerificationEmail from '@utils/verifyEmail';
import { insertTokenInApplicantVerification, sendApplicantVerificationDetails, verifyApplicantEmail } from '@models/Verify';
import logger from '@utils/logger';

const router = express.Router();

router.get('/send-verify-email',
    isApplicant,
    async (req, res) => {
        try {
            const token = uuidv4();
            const userId = req.user!.user.basics.id;

            insertTokenInApplicantVerification(token, userId);

            const user = req.user?.user;
            console.log(user);
            //sendVerificationEmail(user, token);

            res.json({ message: "Successfully sent verification email", success: true });
        } catch (err) {
            logger.error('Error in Sending job verification email', err);
            res
                .status(500)
                .json({ message: 'Something went wrong!', success: false });
        }
    },
);

router.get(
    '/verify-email/:token',
    isApplicant,
    param('token').isString().isLength({ min: 36, max: 36 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ message: errors.array(), success: false });
                return;
            }

            const token = req.params.token;
            const userId = req.user!.user.basics.id;

            verifyApplicantEmail(token);

            res.json({ message: "Successfully verified email", success: true });
        } catch (err) {
            logger.error('Error in Verifying email', err);
            res
                .status(500)
                .json({ message: 'Something went wrong!', success: false });
        }
    },
);

export default router;
