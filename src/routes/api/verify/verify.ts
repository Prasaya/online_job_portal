import express from 'express';
import { param, validationResult, checkSchema } from 'express-validator';
import { isApplicant } from '@middleware/authorization';
import { v4 as uuidv4 } from 'uuid';
import sendVerificationEmail from '@utils/verifyEmail';
import { isUserVerified, insertTokenInVerification, verifyEmail } from '@models/Verify';
import logger from '@utils/logger';
import { isLoggedIn } from '@middleware/authentication';
import { sendNotifications } from '@models/Notification';

const router = express.Router();

router.post('/send-verify-email',
    isLoggedIn,
    async (req, res) => {
        try {
            const token = uuidv4();
            const userId = req.user!.user.basics.id;
            // TODO: finalize what to send in success if already verified
            console.log(await isUserVerified(userId));
            if ((await isUserVerified(userId)).message !== 0) {
                res.json({ message: "User already verified", success: true });
                return;
            }

            const user = req.user?.user;
            await sendVerificationEmail(user, token);

            const { status, message, success } = await insertTokenInVerification(token, userId);
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

            const { status, message, success } = await verifyEmail(token);

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
        await sendNotifications("220f168f-4477-4d11-9930-7f1b0cda9a8e", "1dcc2c55-b97c-4115-9405-32b7541be068");
        res.json({ message: "in test" });
    },
);

// TODO: check to use isLoggedIn or isApplicant
router.get(
    '/status',
    isLoggedIn,
    async (req, res) => {
        try {
            const userId = req.user!.user.basics.id;

            const { status, message, success } = await isUserVerified(userId);
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
