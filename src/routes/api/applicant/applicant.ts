import { isApplicant } from '@middleware/authorization';
import express, { Request, Response } from 'express';
import academicsRoute from '../applicant/academics';
import avatarRoute from './avatar';
import jobsRoute from './jobs';
import skillsRoute from './skills';
import { checkSchema, validationResult } from 'express-validator';
import { updateUser, updateUserSchema } from '@models/User';
import { UpdateUser } from '@typings/User';
import logger from '@utils/logger';

const router = express.Router();
router.use(isApplicant);

router.use('/academics', academicsRoute);
router.use('/avatar', avatarRoute);
router.use('/jobs', jobsRoute);
router.use('/skills', skillsRoute);

router.get('/', (req, res) => {
  res.json({
    user: req.user?.user,
    success: true,
  });
});

router.put(
  '/',
  checkSchema(updateUserSchema),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: errors.array(), success: false });
      }

      let uId = req.user!.user.basics.id;
      const userData: UpdateUser = {
        id: req.user!.user.basics.id,
        firstName: req.body.firstName || null,
        middleName: req.body.middleName || null,
        lastName: req.body.lastName || null,
        birthday: req.body.birthday || null,
        phone: req.body.phone || null,
        gender: req.body.gender || null,
      };
      const result = await updateUser(userData);
      return res.json({ result, success: true });
    } catch (err) {
      logger.error(`Error in changing user details: ${err}`);
      return res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
);

export default router;
