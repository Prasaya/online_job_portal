// @ts-nocheck

import express, { Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { createJobseeker, jobseekerRegisterSchema } from '@models/User';
import {
  organizationRegisterSchema,
  createNewOrganization,
} from '@models/Organization';
import { NewJobseekerInput, Jobseeker } from '@typings/User';
import logger from '@utils/logger';
import { Organization, NewOrganizationInput } from '@typings/Organization';
import { getAuthUser } from '@models/Auth';
import { insertVerificationRegister } from '@models/Verify';
import { getEnv } from '@root/services/Configuration/env';

const router = express.Router();

const url = `localhost:${getEnv('PORT', '8080')}`;

router.post(
  '/organization',
  checkSchema(organizationRegisterSchema),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: errors.array(), success: false });
      }

      const existingUser = await getAuthUser(req.body.email);
      if (existingUser !== null) {
        return res
          .status(400)
          .json({ message: 'User is already registered', success: false });
      }

      const organizationData: NewOrganizationInput = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        description: req.body.description || null,
        address: req.body.address || null,
        city: req.body.city || null,
        website: req.body.website || null,
        phone: req.body.phone || null,
      };
      const organization: Organization = await createNewOrganization(
        organizationData,
      );

      await insertVerificationRegister(organization.id);

      return res.json({ organization, success: true });
    } catch (err) {
      logger.error(err);
      return res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
);

router.post(
  '/',
  checkSchema(jobseekerRegisterSchema),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: errors.array(), success: false });
      }

      const existingUser = await getAuthUser(req.body.email);
      if (existingUser !== null) {
        return res
          .status(400)
          .json({ message: 'User is already registered', success: false });
      }

      const userData: NewJobseekerInput = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName || null,
        middleName: req.body.middleName || null,
        lastName: req.body.lastName || null,
        birthday: req.body.birthday || null,
        phone: req.body.phone || null,
        gender: req.body.gender || null,
      };
      const user: Jobseeker = await createJobseeker(userData);

      await insertVerificationRegister(user.basics.id);

      // await axios.get(`http://localhost:5000/newUser/${user.id}`);

      return res.json({ user, success: true });
    } catch (err) {
      logger.error(`Error in registration: ${err}`);
      return res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
);

export default router;
