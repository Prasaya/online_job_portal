import express from 'express';
import { param, validationResult, checkSchema } from 'express-validator';
import connection from '@utils/dbSetup';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { isApplicant } from '@middleware/authorization';
import { randomUUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import sendVerificationEmail from '@utils/verifyEmail';
import { isApplicantVerified, insertTokenInApplicantVerification, verifyApplicantEmail } from '@models/Verify';
import logger from '@utils/logger';

const router = express.Router();

router.post('/send-verify-email',
    isApplicant,
    async (req, res) => {
        try {
            const token = uuidv4();
            const userId = req.user!.user.basics.id;
            // TODO: finalize what to send in success if already verified
            console.log(await isApplicantVerified(userId));
            if ((await isApplicantVerified(userId)).message !== 0) {
                res.json({ message: "Applicant already verified", success: true });
                return;
            }

            const user = req.user?.user;
            await sendVerificationEmail(user, token);

            const { status, message, success } = await insertTokenInApplicantVerification(token, userId);
            res
                .status(status)
                .json({ message: message, success: success });

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

            const { status, message, success } = await verifyApplicantEmail(token);

            res
                .status(status)
                .json({ message: message, success: success });
        } catch (err) {
            logger.error('Error in Verifying email', err);
            res
                .status(500)
                .json({ message: 'Something went wrong!', success: false });
        }
    },
);

// Route to test verification functions in model
router.get(
    '/test',
    async (req, res) => {
        res.json({ message: "in test" });
    },
);

router.get(
    '/status',
    isApplicant,
    async (req, res) => {
        try {
            const userId = req.user!.user.basics.id;

            const { status, message, success } = await isApplicantVerified(userId);
            res
                .status(status)
                .json({ message: message, success: success });

        } catch (err) {
            logger.error('Error in checking status email', err);
            res
                .status(500)
                .json({ message: 'Something went wrong!', success: false });
        }
    },
);


export default router;
