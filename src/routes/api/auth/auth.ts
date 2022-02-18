import express from 'express';
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

export default router;
