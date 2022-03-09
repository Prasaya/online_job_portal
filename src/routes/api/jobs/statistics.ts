import express, { Request, Response } from 'express';
import { param, validationResult, checkSchema, body } from 'express-validator';
import connection from '@utils/dbSetup';
import { RowDataPacket, FieldPacket } from 'mysql2';
import logger from '@utils/logger';
import { formatDate } from '@utils/date';
import { getStatistics, incrementLinkOpen, insertJobEmailStatistics, insertJobSmsStatistics } from '@models/Statistics';

const router = express.Router();

router.post('/insert',
    body('jobId').isString().isLength({ min: 36, max: 36 }),
    body('applicantId').isString().isLength({ min: 36, max: 36 }),
    body('type').isIn(['email', 'sms']),
    async (req, res) => {
        try {
            let type = req.body.type;
            let jobId = req.body.jobId;
            let applicantId = req.body.applicantId;

            if (type === 'sms') {
                insertJobSmsStatistics(jobId, applicantId);
            }
            else if (type === 'email') {
                insertJobEmailStatistics(jobId, applicantId);
            }

            res.json({ message: "Inserted into table", success: true });

        } catch (err) {
            logger.error('Error in Getting all jobs by page', err);
            res.status(500).json({ message: 'Something went wrong!', success: false });
        }
    }
);

router.get(
    '/stats/:jobId',
    async (req, res) => {
        const jobId = req.params.jobId;
        const { status, ...rest } = await getStatistics(jobId);
        return res.status(status).json(rest);
    }
)

export default router;

