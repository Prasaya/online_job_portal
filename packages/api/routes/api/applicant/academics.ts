import connection from '@utils/dbSetup';
import express, { Request, Response } from 'express';
import { isApplicant } from '@middleware/authorization';
import {
  addJobseekerAcademics,
  replaceJobseeerAcademics,
  replaceJobseekerSkills,
  jobseekerAcademicsSchema,
} from '@models/User';
import logger from '@utils/logger';
import { checkSchema, validationResult } from 'express-validator';
import { Jobseeker } from '@typings/User';
import { QueryError } from 'mysql2';

const router = express.Router();

router.get('/', async (req, res) => {
  const userData = req.user?.user as Jobseeker;
  res.json({ academics: userData.academics, success: true });
});

router.post(
  '/',
  checkSchema(jobseekerAcademicsSchema),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false });
    }
    const { status, ...message } = await addJobseekerAcademics(
      req.user!.user.basics.id,
      req.body.academics,
      false,
    );
    res.json(message);
  },
);

router.put(
  '/',
  checkSchema(jobseekerAcademicsSchema),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false });
    }
    const { status, ...message } = await replaceJobseeerAcademics(
      req.user!.user.basics.id,
      req.body.academics,
    );
    res.json(message);
  },
);

export default router;
