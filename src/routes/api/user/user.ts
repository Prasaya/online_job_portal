import { isLoggedIn } from '@middleware/authentication';
import { searchUser } from '@models/Auth';
import express from 'express';
import connection from '@utils/dbSetup';

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  res.json({
    user: req.user?.user,
    success: true,
  });
});

router.delete('/', isLoggedIn, async (req, res) => {
  const result = await connection.query('CALL deleteUser(?)', [
    req.user?.user.basics.id,
  ]);
  res.json({ message: 'User deleted successfully!', result, success: true });
});

export default router;
