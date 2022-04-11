// @ts-nocheck

import express from 'express';
import connection from '@utils/dbSetup';
import { param } from 'express-validator';
import logger from '@utils/logger';
import { FieldPacket, RowDataPacket } from 'mysql2';

const router = express.Router();

router.get('/rank/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const applicantId = req.user?.user.basics.id;
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      `SELECT position from (
        SELECT aj.jobId, aj.applicantId,
                RANK() OVER(ORDER BY jm.score DESC) position
        FROM jobMatchScore as jm
        INNER JOIN applicant_jobs as aj ON(jm.jobId = aj.jobId) AND(aj.applicantId = jm.applicantId)
        ORDER BY position DESC) as val
            WHERE(val.jobId = ?) AND(val.applicantId = ?) `,
      [jobId, applicantId],
    );
    const [count]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      `select count(*) as count from applicant_jobs
          where jobId = ? `,
      [jobId],
    );

    let data = {
      rank: result.length > 0 ? result[0].position : 1,
      totalApplicants: count[0].count,
    };

    res.json({ data, success: true });
  } catch (err) {
    logger.error(`Error in getting job details: ${err}`);
    res.status(500).json({ message: 'Something went wrong!', success: false });
  }
});

router.get('/', async (req, res) => {
  try {
    const id = req.user?.user.basics.id;
    const [rows] = await connection.execute('CALL getApplicantJobs(?)', [id]);
    let jobs;
    if (
      !Array.isArray(rows) ||
      !rows.length ||
      !Array.isArray(rows[0]) ||
      !rows[0].length
    ) {
      jobs = [];
    } else {
      jobs = rows[0][0].jobs || [];
    }
    res.json({ jobs, success: true });
  } catch (error) {
    logger.error('Error in getApplicantJob', error);
    res.status(500).json({ message: 'Something went wrong!', success: false });
  }
});

router.post(
  '/',
  param('jobId').isString().isLength({ min: 36, max: 36 }),
  async (req, res) => {
    try {
      await connection.execute('CALL applyForJob(?, ?)', [
        req.user?.user.basics.id,
        req.body.jobId,
      ]);
      return res.json({ jobId: req.body.jobId, success: true });
    } catch (error) {
      if (error.errno === 1452) {
        res.status(400).json({
          message: 'Job doesnt exist',
          success: false,
        });
        return;
      }
      if (error.errno === 1062) {
        res.status(400).json({
          message: 'You have already applied for this job',
          success: false,
        });
        return;
      }
      res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
);

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await connection.execute('CALL deleteApplicantJob(?, ?)', [
      req.user?.user.basics.id,
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error in deleteApplicantJob', error);
    res.status(500).json({ message: 'Something went wrong!', success: false });
  }
});

export default router;
