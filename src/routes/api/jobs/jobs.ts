import express, { query } from 'express';
import { body, validationResult } from 'express-validator';
import { createNewJobPost } from '@root/models/Jobs';
import JobPost, { NewJobPost, DBJobPost } from '@typings/JobPost';
import DBJob, { Job, JobInput } from '@typings/Jobs'
import connection from '@utils/dbSetup';
import { RowDataPacket } from 'mysql2';
import isLoggedIn from '@middleware/isLoggedIn';

const router = express.Router();

//router.get('/', isLoggedIn,
router.get('/',
    async (req, res) => {
        const [result] = await connection.query(
            'SELECT * FROM jobs '
        );
        const [result2] = await connection.query(
            'SELECT * FROM skills '
        );
        let job_list: any = {};
        (result as RowDataPacket[]).forEach(job => {
            job_list[job.jobId] = { ...job, skills: [] };
        }
        );
        (result2 as RowDataPacket[]).forEach(skill => {
            job_list[skill.jobId].skills.push(skill);
        });
        res.json(Object.values(job_list));
    }
);

router.post(
    '/',
    body('title').isString().isLength({ max: 100 }),
    body('description').isString().optional(),
    body('vacancies').isNumeric().optional(),
    body('experience').isNumeric().optional(),
    body('address').isString().isLength({ max: 1000 }).optional(),
    body('district').isString().isLength({ max: 1000 }).optional(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array(), success: false });
            }


            const jobPostData: JobInput = {
                title: req.body.title,
                description: req.body.description,
                vacancies: req.body.vacancies,
                experience: req.body.experience,
                address: req.body.address,
                district: req.body.district,
                qualifications: req.body.qualifications,
                skills: req.body.skills
            };
            const user = await createNewJobPost(jobPostData);
            res.json({ ...user });
        } catch (err) {
            console.log('Error in job post creation', err);
            res.status(500).json({ message: 'Something went wrong!', success: false });
        }
    }
);

router.put('/:id', async (req, res) => {

});


router.patch('/', async (req, res) => {

});

router.delete('/:id',
    async (req, res) => {
        const jobID = req.params.id;
        try {
            await connection.query(
                'DELETE FROM skills ' +
                'WHERE jobId = ?',
                [jobID]
            );
            await connection.query(
                'DELETE FROM jobs ' +
                'WHERE jobId = ?',
                [jobID]
            );
        } catch (err) {
            console.log('Error in job delete operation', err);
            res.status(500).json({ message: 'Something went wrong!', success: false });
        }
        res.status(200).json({ message: 'Job deleted', success: true });
    });

export default router;
