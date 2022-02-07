import express, { Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import {
    createNewUser, registerSchema, verifyEmail
} from '@root/models/User';
import { NewUserInput, User } from '@typings/User';
import logger from '@root/utils/logger';

const router = express.Router();

router.post(
    '/',
    checkSchema(registerSchema),
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array(), success: false });
            }

            if (await verifyEmail(req.body.email)) {
                return res
                    .status(400)
                    .json({ message: 'User is already registered', success: false });
            }

            const userData: NewUserInput = {
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.firstName || null,
                middleName: req.body.middleName || null,
                lastName: req.body.lastName || null,
                picture: req.body.picture || null,
                birthday: req.body.birthday || null,
                phone: req.body.phone || null,
                gender: req.body.gender || null,
            };
            const user: User = await createNewUser(userData);
            return res.json(user);
        } catch (err) {
            logger.error(`Error in registration: ${err}`);
            res.status(500).json({ message: 'Something went wrong!', success: false });
        }
    }
);

export default router;
