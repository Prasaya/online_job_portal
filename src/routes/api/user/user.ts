import isLoggedIn from '@root/middleware/isLoggedIn';
import { getUserByUid } from '@root/models/User';
import express from 'express';

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
    res.json({
        user: { ...req.user, password: '' },
        success: true,
    });
});

router.
    get('/:uid', (req, res) => {
        const user = getUserByUid(req.params.uid);
        if (user === null) {
            return res.status(404).json({ message: 'Could not find error.', success: false });
        }
        return res.json({
            user,
            success: true
        });
    })
    .put('/:uid', (req, res) => {
    });

export default router;
