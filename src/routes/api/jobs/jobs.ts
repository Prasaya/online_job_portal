import express, { Request, Response } from 'express';
import { param, query, validationResult, checkSchema } from 'express-validator';
import {
  createNewJobPost,
  deleteJobPost,
  JobCreationSchema,
} from '@models/Jobs';
import DBJob, { Job, JobInput, JobReturn } from '@typings/Jobs';
import connection from '@utils/dbSetup';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { isOrganization } from '@middleware/authorization'
import logger from '@utils/logger';
import { fetchOrganizationJobs } from '../organization/organization';

const router = express.Router();

router.get('/',
  async (req, res) => {
    try {
      let numPerPage = 10;
      let page = 1;
      try {
        page = req.query.page ? parseInt(req.query.page as string) : 1;
      } catch (error) { }
      const [count_result]: [RowDataPacket[], FieldPacket[]]
        = await connection.execute('SELECT count(*) as numRows FROM allJobsFromDatabase');
      var numRows = count_result[0].numRows;
      var numPages = Math.ceil(numRows / numPerPage);
      let skip = (page - 1) * numPerPage;
      let limit = skip + ',' + numPerPage;
      const [result]: [RowDataPacket[], FieldPacket[]]
        = await connection.execute('SELECT * FROM allJobsFromDatabase LIMIT ' + limit)
      let to_send = {
        page: page,
        numPages: numPages,
        totalJobs: numRows,
        jobs: result
      }
      res.json({ jobList: to_send, success: true });
    } catch (err) {
      logger.error('Error in Getting all jobs by page', err);
      res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
);


router.get(
  '/:id',
  param('id').isString().isLength({ min: 36, max: 36 }),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array(), success: false });
        return;
      }
      const jobID = req.params.id;
      const [result]: [RowDataPacket[], FieldPacket[]]
        = await connection.execute('CALL getJobFromId(?)', [jobID]);
      console.log(result);
      res.json({ jobDetails: result[0][0], success: true });
    } catch (err) {
      logger.error('Error in Getting single Job', err);
      res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
);


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


router.get('/test/1', async (req, res) => {
  const [result] = await connection.query('SELECT * from allJobs');

  let x: JobReturn = {
    "jobId": "",
    "companyId": "",
    "title": "",
    "description": "Be a senior developer",
    "vacancies": 3,
    "experience": 5,
    "address": "",
    "district": "",
    "skills": [],
    "qualifications": [],
  }
  const to_send: { [id: string]: typeof x } = {};

  let xskills = {
    "skillName": "",
    "proficiency": ""
  }
  let xqualifications = {
    "qid": "",
    "level": "",
    "degree": "",
    discipline: ""
  };
  (result as RowDataPacket[]).forEach(a => {
    xskills.skillName = a.skillName;
    xskills.proficiency = a.proficiency;
    xqualifications.qid = a.qid;
    xqualifications.level = a.level;
    if (a.jobId in to_send) {
      console.log(a.skillName, to_send[a.jobId].skills.filter(s => s.skillName === a.skillName));
      if (to_send[a.jobId].skills.filter(s => s.skillName === a.skillName).length === 0) {
        to_send[a.jobId].skills.push({ ...xskills });
      }
      if (to_send[a.jobId].qualifications.filter(q => q.qid === a.qid).length === 0) {
        to_send[a.jobId].qualifications.push({ ...xqualifications });
      }
    }

    else {
      let x = {
        "jobId": a.jobId,
        "companyId": a.companyId,
        "title": a.title,
        "description": a.description,
        "vacancies": a.vacancies,
        "experience": a.experience,
        "address": a.address,
        "district": "",
        "skills": [xskills],
        "qualifications": [xqualifications],
      }
      to_send[a.jobId] = x;
    }
  });

  res.json({ to_send });
});

router.get('/test1/1', async (req, res) => {
  const [result] = await connection.query('SELECT * from allJobsFromDatabase');
  res.json({ result });
});


export default router;