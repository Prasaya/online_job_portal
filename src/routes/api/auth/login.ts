import express from 'express';
import passport from 'passport';

const router = express.Router();

router.post(
    '/',
    passport.authenticate(
        'local',
        {
            failureRedirect: '/api/auth/failed',
            failureMessage: true,
        },
    ),
    (req, res) => {
        res.redirect('/api/userinfo');
    },
);

export default router;
