import logger from '@utils/logger';
import express from 'express';
import passport from 'passport';

const router = express.Router();
router.get(
    '/',
    passport.authenticate(
        'google',
        {
            scope: [
                'profile',
                'email',
            ],
        },
    ),
);

router.get(
    '/callback',
    (req, res, next) => {
        passport.authenticate(
            'google',
            (err, user, info) => {
                if (err || !user) {
                    logger.error(`Error while logging in. Error: ${err} Info: ${info}`);
                    req.session.messages = info;
                    return res.redirect('/failed');
                }
                return req.login(
                    user,
                    (error) => {
                        if (error) {
                            logger.error(`Error while logging in user: ${error}`);
                            return next(error);
                        }
                        return res.redirect('/api/userinfo');
                    },
                );
            },
        )(
            req,
            res,
            next,
        );
    },
);

export default router;
