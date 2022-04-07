// @ts-nocheck

import express, { Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { createNewUser, applicantRegisterSchema } from '@models/User';
import {
  organizationRegisterSchema,
  createNewOrganization,
} from '@models/Organization';
import { NewUserInput, User } from '@typings/User';
import logger from '@utils/logger';
import { Organization, NewOrganizationInput } from '@typings/Organization';
import { getAuthUser } from '@models/Auth';
import { insertVerificationRegister } from '@models/Verify';
import axios from 'axios';

const router = express.Router();

const url = `localhost:${process.env.PORT || 8080}`;

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
  checkSchema(applicantRegisterSchema),
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

      const userData: NewUserInput = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName || null,
        middleName: req.body.middleName || null,
        lastName: req.body.lastName || null,
        picture: req.body.picture || null,
        birthday: req.body.birthday || null,
        phone: req.body.phone || null,
        gender: req.body.gender || null,
      };
      const user: User = await createNewUser(userData);

      await insertVerificationRegister(user.id);

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
