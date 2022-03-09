import { isLoggedIn } from '@middleware/authentication';
import { searchUser } from '@models/Auth';
import express from 'express';
import connection from '@utils/dbSetup';
import applicantRoute from '@routes/api/applicant/applicant';
import { param, validationResult } from 'express-validator';
import logger from '@utils/logger';
import { getUserById } from '@models/User';
import { formatDate } from '@utils/date';

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  res.json({
    user: req.user?.user,
    success: true,
  });
});

// TODO: Separate into applicant
router.use('/', applicantRoute);

router.delete('/', isLoggedIn, async (req, res) => {
  const result = await connection.query('CALL deleteUser(?)', [
    req.user?.user.basics.id,
  ]);
  res.json({ message: 'User deleted successfully!', result, success: true });
});

router.get('/public/:userId',
  param('userId').isString().isLength({ min: 36, max: 36 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array(), success: false });
        return;
      }
      const userId = req.params.userId;

      let user = await getUserById(userId);

      user.basics.birthday = formatDate(user.basics.birthday);

      res.json({ userData: user, success: true });

    } catch (err) {
      logger.error('Error in getting user by id', err);
    }
  }
);

export default router;
