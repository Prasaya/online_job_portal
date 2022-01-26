import express from 'express';
import { body, validationResult } from 'express-validator';
import { createNewUser, getUserByEmail, verifyEmail } from '@root/models/User';
import { NewUserInput } from '@typings/User';

const router = express.Router();

router.post(
    '/',
    body('email').isEmail().isLength({ max: 50 }),
    body('password').isLength({ min: 8 }),
    body('firstName').isString().isLength({ max: 50 }).optional(),
    body('middleName').isString().isLength({ max: 50 }).optional(),
    body('lastName').isString().isLength({ max: 50 }).optional(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array(), success: false });
            }

            console.log('here');
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
            };
            const user = await createNewUser(userData);
            res.json({ ...user, password: '' });
        } catch (err) {
            console.log('Error in registration', err);
            res.status(500).json({ message: 'Something went wrong!', success: false });
        }
    }
);

export default router;
