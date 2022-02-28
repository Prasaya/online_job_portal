import express from 'express';
import connection from '@utils/dbSetup';
import { param } from 'express-validator';
import logger from '@utils/logger';

const router = express.Router();

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

export default router;
