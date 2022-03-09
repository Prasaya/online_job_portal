import express, { Request, Response } from 'express';
import { userSkillsSchema, addApplicantSkills, replaceApplicantSkills } from '@models/User';
import { User } from '@typings/User';
import { checkSchema, validationResult } from 'express-validator';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  const userData = req.user?.user as User;
  res.json({ skills: userData.skills, success: true });
});

router.post(
  '/',
  checkSchema(userSkillsSchema),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false });
    }
    const { status, ...message } = await addApplicantSkills(
      req.user!.user.basics.id,
      req.body.skills,
      false,
    );
    // let id = req.user!.user.basics.id;
    // await axios.get(`http://localhost:5000/newUser/${id}`);
    res.json(message);
  },
);

router.put(
  '/',
  checkSchema(userSkillsSchema),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false });
    }
    const { status, ...message } = await replaceApplicantSkills(
      req.user!.user.basics.id,
      req.body.skills,
    );
    // let id = req.user!.user.basics.id;
    // await axios.get(`http://localhost:5000/newUser/${id}`);
    res.json(message);
  },
);

export default router;
