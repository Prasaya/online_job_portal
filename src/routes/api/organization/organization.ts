import express, { Request, Response } from 'express';
import { isOrganization } from '@middleware/authorization';
import logger from '@utils/logger';
import {
  fetchOrganizationJobs,
  updateOrganization,
  updateOrganizationSchema,
} from '@models/Organization';
import logoRouter from './logo';
import { checkSchema, validationResult } from 'express-validator';
import { UpdateOrganization } from '@typings/Organization';

const router = express.Router();
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

export default router;
