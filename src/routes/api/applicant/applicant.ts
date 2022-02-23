import { isApplicant } from '@middleware/authorization';
import express from 'express';
import academicsRoute from '../applicant/academics';
import avatarRoute from './avatar';
import jobsRoute from './jobs';
import skillsRoute from './skills';

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

router.put('/', (req, res) => {});

export default router;
