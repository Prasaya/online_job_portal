import express from 'express';
import connection from '@utils/dbSetup';
import { body } from 'express-validator';
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
  body('jobId').isString().isLength({ min: 36, max: 36 }),
  async (req, res) => {
    try {
      await connection.execute('CALL applyForJob(?, ?)', [
        req.user?.user.basics.id,
        req.body.jobId,
      ]);
      return res.json({ jobId: req.body.jobId, success: true });
    } catch (error) {
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
