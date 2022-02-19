import { isLoggedIn } from '@middleware/authentication';
import { searchUser } from '@models/Auth';
import express from 'express';
import connection from '@utils/dbSetup';
import academicsRoute from './academics';
import avatarRoute from './avatar';
import skillsRoute from './skills';

const router = express.Router();

router.use('/academics', academicsRoute);
router.use('/avatar', avatarRoute);
router.use('/skills', skillsRoute);

router.get('/', isLoggedIn, (req, res) => {
  res.json({
    user: req.user?.user,
    success: true,
  });
});

router.get('/:uid', async (req, res) => {
  const user = await searchUser('Users', req.params.uid);
  if (user === null) {
    return res.status(404).json({
      message: `Could not find user ${req.params.uid}.`,
      success: false,
    });
  }
  const userData = user.basics;
  return res.json({
    id: userData.id,
    email: userData.email,
    type: userData.type,
    firstName: userData.firstName,
    middleName: userData.middleName,
    lastName: userData.lastName,
    picture: userData.picture,
    success: true,
  });
});

router.delete('/:uid', isLoggedIn, async (req, res) => {
  if (req.user?.user.basics.id !== req.params.uid) {
    res
      .status(403)
      .json({ message: 'You cannot delete this user!', success: false });
    return;
  }
  const result = await connection.query('CALL deleteUser(?)', [req.params.uid]);
  res.json({ message: 'User deleted successfully!', result, success: true });
});

export default router;
