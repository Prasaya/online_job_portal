import logger from '@root/utils/logger';
import express from 'express';
import passport from 'passport';
import { nextTick } from 'process';

const router = express.Router();

router.post(
    '/',
    (req, res, next) => {
        passport.authenticate(
            'local',
            (err, user, info) => {
                if (err) {
                    logger.error(err);
                    return next(err);
                }
                if (!user) {
                    return res.status(401).json({ message: info.message, success: false });
                }
                req.logIn(
                    user,
                    (loginError) => {
                        if (loginError) {
                            logger.error(loginError);
                            return next(loginError);
                        }
                        return res.json({ user, success: true });
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
