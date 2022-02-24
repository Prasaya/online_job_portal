import express from 'express';
import { isOrganization } from '@middleware/authorization';
import logger from '@utils/logger';
import {fetchOrganizationJobs} from '@models/Organization';

const router = express.Router();
router.use(isOrganization);

router.get('/', (req, res) => {
  res.json({
    user: req.user?.user,
    success: true,
  });
});

// TODO: Add/Merge applicant
router.get('/jobs', async (req, res) => {
  try {
    const companyID = req.user!.user.basics.id;
    const result = await fetchOrganizationJobs(companyID);
    res.json(result);
  } catch (err) {
    logger.error('Error in getting all jobs posted by company', err);
    res.status(500).json({ message: 'Something went wrong!', success: false });
  }
});

router.put('/', (req, res) => {});

export default router;
