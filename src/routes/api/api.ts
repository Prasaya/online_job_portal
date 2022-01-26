import express, { Request } from 'express';
import isLoggedIn from '@middleware/isLoggedIn';
import authRoute from './auth/auth';

const router = express.Router();

router.use('/auth', authRoute);

router.get('/userinfo', isLoggedIn, (req: Request, res) => {
    res.json({
        user: req.user, session: req.session, success: true,
    });
});

router.get('/', (req, res) => {
    res.json({ message: 'This is the api page!', success: true });
});

router.get('*', (req, res) => {
    res.status(404).json({ message: 'Could not find page!', success: false });
});

export default router;
