import { isLoggedIn } from '@middleware/authentication';
import { param, validationResult, checkSchema } from 'express-validator';
import express from 'express';
import connection from '@utils/dbSetup';
import { isOrganization } from '@middleware/authorization';
import logger from '@utils/logger';

const router = express.Router();
router.use(isOrganization);

router.get('/', (req, res) => {
  res.json({
    user: req.user?.user,
    success: true,
  });
});

export const fetchOrganizationJobs = async (companyId: string) => {
  const [result] = await connection.execute('CALL getCompanyJobsData(?)', [companyId]);
  if (Array.isArray(result)) {
    return { jobList: result[0], success: true };
  }
  return { jobList: [], success: false };
}

// TODO: Add/Merge applicant 
router.get(
  '/jobs',
  async (req, res) => {
    try {
      const companyID = req.user!.user.basics.id;
      const result = (await fetchOrganizationJobs(companyID));
      res.json(result);
    } catch (err) {
      logger.error('Error in getting all jobs posted by company', err);
      res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
);

export default router;