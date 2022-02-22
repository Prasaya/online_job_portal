import express, { Request, Response } from 'express';
import { param, validationResult, checkSchema } from 'express-validator';
import {
  createNewJobPost,
  deleteJobPost,
  JobCreationSchema,
} from '@models/Jobs';
import DBJob, { Job, JobInput } from '@typings/Jobs';
import connection from '@utils/dbSetup';
import { RowDataPacket } from 'mysql2';
import { isOrganization } from '@middleware/authorization'
import logger from '@utils/logger';
import { fetchOrganizationJobs } from '../organization/organization';

const router = express.Router();

// TODO: Implement pagination
router.get('/', async (req, res) => {
  const [result] = await connection.query('SELECT * FROM jobs ');
  const [result2] = await connection.query('SELECT * FROM skills ');
  const jobList: unknown = {};
  (result as RowDataPacket[]).forEach((job) => {
    jobList[job.jobId] = { ...job, skills: [] };
  });
  (result2 as RowDataPacket[]).forEach((skill) => {
    jobList[skill.jobId].skills.push(skill);
  });
  res.json(Object.values(jobList));
});

router.post(
  '/',
  isOrganization,
  checkSchema(JobCreationSchema),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: errors.array(), success: false });
      }

      const jobPostData: JobInput = {
        companyId: req.user!.user.basics.id,
        title: req.body.title,
        description: req.body.description,
        vacancies: req.body.vacancies,
        experience: req.body.experience,
        address: req.body.address,
        district: req.body.district,
        qualifications: req.body.qualifications,
        skills: req.body.skills,
      };
      const user = await createNewJobPost(jobPostData);
      return res.json({ jobDetails: user, success: true });
    } catch (err) {
      logger.error(err);
      return res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
);

router.delete(
  '/:id',
  isOrganization,
  param('id').isString().isLength({ min: 36, max: 36 }),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array(), success: false });
        return;
      }
      const jobID = req.params.id;
      deleteJobPost(jobID);
    } catch (err) {
      logger.error('Error in Job Deletion', err);
      res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
    res.status(200).json({ message: 'Job deleted', success: true });
  },
);


router.get('/organization/:id',
  param('id').isString().isLength({ min: 36, max: 36 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array(), success: false });
        return;
      }
      const companyID = req.params.id;
      res.json(await fetchOrganizationJobs(companyID));
    } catch (err) {
      logger.error('Error in getting all jobs posted by company', err);
      res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
)



export default router;
