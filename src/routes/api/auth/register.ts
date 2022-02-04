import express from 'express';
import { body, validationResult } from 'express-validator';
import { createNewUser, getUserByEmail, verifyEmail } from '@root/models/User';
import { NewUserInput, User } from '@typings/User';
import logger from '@root/utils/logger';

const router = express.Router();

router.post(
    '/',
    body('email').isEmail().isLength({ max: 250 }),
    body('password').isLength({ min: 8 }),
    body('firstName').optional().default(null).isString().isLength({ max: 50 }),
    body('middleName').optional().default(null).isString().isLength({ max: 50 }),
    body('lastName').optional().default(null).isString().isLength({ max: 50 }),
    body('birthday').optional().default(null).isDate(),
    body('phone').optional().default(null).isString().isLength({ max: 20 }),
    body('gender').optional().default(null).isString().isLength({ max: 10 }),
    async (req, res) => {
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
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
                picture: req.body.picture,
                birthday: req.body.birthday,
                phone: req.body.phone,
                gender: req.body.gender,
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
