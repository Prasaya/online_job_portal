import express from 'express';
import googleHandler from './google';
import localLoginHandler from './login';
import localRegisterHandler from './register';

const router = express.Router();

router.use(
    '/google',
    googleHandler,
);
router.use(
    '/login',
    localLoginHandler,
);
router.use(
    '/register',
    localRegisterHandler,
);

router.get(
    '/failed',
    (req, res) => res.json({ message: 'Failed to authenticate', log: req.session.messages, success: false }),
);

router.get(
    '/logout',
    (req, res) => {
        req.logout();
        res.json({ message: 'Logout successful!', success: true });
    },
);

export default router;
