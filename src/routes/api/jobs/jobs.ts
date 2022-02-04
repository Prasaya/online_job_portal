import express, { query } from 'express';
import { body, validationResult } from 'express-validator';
import { createNewUser, getUserByEmail, verifyEmail } from '@root/models/User';
import { createNewJobPost } from '@root/models/JobPost';
import JobPost, { NewJobPost, DBJobPost } from '@typings/JobPost';
import connection from '@utils/dbSetup';
import { RowDataPacket } from 'mysql2';

const router = express.Router();

router.get(
    '/:id',
    async (req, res) => {
        console.log("HI");
        const jobID = req.params.id;
        const [result] = await connection.query(
            'SELECT * FROM jobPost ' +
            'WHERE jid = ?',
            [jobID]
        );
        console.log(result);
        res.send(JSON.parse(JSON.stringify(result)));
    }
);


router.post(
    '/',
    body('title').isString().isLength({ max: 100 }),
    body('jobDescription').isString(),
    body('experience').isString().isLength({ max: 1000 }).optional(),
    body('education').isString().isLength({ max: 1000 }).optional(),
    body('skills').isString().isLength({ max: 1000 }).optional(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array(), success: false });
            }

            console.log('here');

            const jobPostData: NewJobPost = {
                title: req.body.title,
                jobDescription: req.body.jobDescription,
                experience: req.body.experience,
                education: req.body.education,
                skills: req.body.skills,
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
    try {
        const [result] = await connection.query(
            'UPDATE jobPost ' +
            'SET title = ?, jobDescription = ?, experience = ?,' +
            'education = ?, skills = ?' +
            'WHERE jid = ?',
            [
                req.body.title, req.body.jobDescription, req.body.experience,
                req.body.education, req.body.skills, req.params.id
            ]
        );
    } catch (err) {
        console.log('Error in job put operation', err);
        res.status(500).json({ message: 'Something went wrong!', success: false });
    }
    res.json({ message: 'Job Put Operation successful!', success: true });
});


router.patch('/',
    (req, res) => {

    }
)

router.patch('/',
    (req, res) => {

    }
)

router.delete('/:id',
    async (req, res) => {
        const jobID = req.params.id;
        try {
            await connection.query(
                'DELETE FROM jobPost ' +
                'WHERE jid = ?',
                [jobID]
            );
        } catch (err) {
            console.log('Error in job delete operation', err);
            res.status(500).json({ message: 'Something went wrong!', success: false });
        }
        res.status(200).json({ message: 'Job deleted', success: true });
    });

export default router;
