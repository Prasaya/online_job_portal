import { isLoggedIn } from '@middleware/authentication';
import { modifyUser, updateUserSchema } from '@models/Auth';
import logger from '@utils/logger';
import express, { Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import googleHandler from './google';
import localLoginHandler from './login';
import localRegisterHandler from './register';

const router = express.Router();

router.use('/google', googleHandler);
router.use('/login', localLoginHandler);
router.use('/register', localRegisterHandler);

router.post('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful!', success: true });
});

router.put(
  '/edit',
  isLoggedIn,
  checkSchema(updateUserSchema),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false });
    }
    try {
      await modifyUser(
        req.app.locals.dbService,
        req.user?.user.basics.id!,
        req.body.email || null,
        req.body.password || null,
      );
      return res.json({ message: 'User updated successfully', success: true });
    } catch (err) {
      logger.error(`Error in changing user details: ${err}`);
      return res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
);

export default router;
