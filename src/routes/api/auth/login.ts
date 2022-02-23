import logger from '@utils/logger';
import express from 'express';
import { body } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router.post(
  '/',
  body('username').isEmail().normalizeEmail().isLength({ min: 1, max: 255 }),
  body('password').isString(),
  // TODO: Add isNotLoggedIn middleware
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        logger.error(err);
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message, success: false });
      }
      return req.logIn(user, (loginError) => {
        if (loginError) {
          logger.error(loginError);
          return next(loginError);
        }
        return res.json({ user: user.user, success: true });
      });
    })(req, res, next);
  },
);

export default router;
