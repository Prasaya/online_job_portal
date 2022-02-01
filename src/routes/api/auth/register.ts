import express from 'express';
import { body, validationResult } from 'express-validator';
import { createNewUser, getUserByEmail, verifyEmail } from '@root/models/User';
import { NewUserInput } from '@typings/User';

const router = express.Router();

router.post(
    '/',
    body('email').isEmail().isLength({ max: 50 }),
    body('password').isLength({ min: 8 }),
    body('firstName').optional().isString().isLength({ max: 50 }),
    body('middleName').optional().isString().isLength({ max: 50 }),
    body('lastName').optional().isString().isLength({ max: 50 }),
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
                lastName: req.body.lastName,
                picture: req.body.picture,
            };
            const user = await createNewUser(userData);
            return res.json(user);
        } catch (err) {
            console.error('Error in registration', err);
            res.status(500).json({ message: 'Something went wrong!', success: false });
        }
    }
);

export default router;
