// @ts-nocheck

import express, { Request, Response } from 'express';
import { isOrganization } from '@middleware/authorization';
import logger from '@utils/logger';
import {
  fetchOrganizationJobs,
  getOrganizationById,
  updateOrganization,
  updateOrganizationSchema,
} from '@models/Organization';
import logoRouter from './logo';
import { checkSchema, param, validationResult } from 'express-validator';
import { UpdateOrganization } from '@typings/Organization';
import { getStatistics } from '@models/Statistics';

const router = express.Router();

router.get(
  '/public/:organizationId',
  param('organizationId').isString().isLength({ min: 36, max: 36 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array(), success: false });
        return;
      }
      const organizationId = req.params.organizationId;

      let organization = await getOrganizationById(organizationId);

      res.json({ organizationData: organization, success: true });
    } catch (err) {
      logger.error('Error in getting organization by id', err);
    }
  },
);

router.use(isOrganization);

router.use('/logo', logoRouter);

router.get('/', (req, res) => {
  res.json({
    user: req.user?.user,
    success: true,
  });
});

router.put(
  '/',
  checkSchema(updateOrganizationSchema),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: errors.array(), success: false });
      }

      let uId = req.user!.user.basics.id;
      const organizationData: UpdateOrganization = {
        id: req.user!.user.basics.id,
        name: req.body.name || null,
        description: req.body.description || null,
        address: req.body.address || null,
        city: req.body.city || null,
        website: req.body.website || null,
        phone: req.body.phone || null,
      };
      const result = await updateOrganization(organizationData);
      return res.json({ result, success: true });
    } catch (err) {
      logger.error(`Error in changing organization details: ${err}`);
      return res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
);

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

router.get('/:jobId/stats', async (req, res) => {
  const jobId = req.params.jobId;
  const { status, ...rest } = await getStatistics(jobId);
  return res.status(status).json(rest);
});

getStatistics('4f839335-cfd1-494d-a83d-ded26312187c');

export default router;
