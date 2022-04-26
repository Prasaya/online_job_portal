import { isApplicant } from '@middleware/authorization';
import express, { Request, Response } from 'express';
import academicsRoute from './academics';
import avatarRoute from './avatar';
import jobsRoute from './jobs';
import skillsRoute from './skills';
import { updateJobseeker, jobseekerUpdateSchema } from '@models/User';
import { UpdateJobseekerParameters } from '@typings/User';
import logger from '@utils/logger';
import schemaHandler from '@middleware/schemaHandler';

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
  schemaHandler(jobseekerUpdateSchema),
  async (req: Request, res: Response) => {
    try {
      const userData: UpdateJobseekerParameters = {
        id: req.user!.user.basics.id,
        firstName: req.body.firstName || null,
        middleName: req.body.middleName || null,
        lastName: req.body.lastName || null,
        birthday: req.body.birthday || null,
        phone: req.body.phone || null,
        gender: req.body.gender || null,
      };
      const result = await updateJobseeker(userData);
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
