import isLoggedIn from '@middleware/isLoggedIn';
import { searchUser } from '@root/models/Auth';
import express from 'express';

const router = express.Router();

router.get(
    '/',
    isLoggedIn,
    (req, res) => {
        res.json({
            user: req.user,
            success: true,
        });
    },
);

router
    .get(
        '/:uid',
        async (req, res) => {
            const user = await searchUser('Users', req.params.uid);
            if (user === null) {
                return res.status(404).json({ message: 'Could not find user.', success: false });
            }
            return res.json({
                user,
                success: true,
            });
        },
    );

export default router;
