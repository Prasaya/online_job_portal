import express, { Request, Response } from 'express';
import { userSkillsSchema, addApplicantSkills } from '@models/User';
import { User } from '@typings/User';
import { checkSchema, validationResult } from 'express-validator';

const router = express.Router();

router.get('/skills', async (req, res) => {
  const userData = req.user?.user as User;
  res.json({ skills: userData.skills, success: true });
});

router.post(
  '/skills',
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
    res.json(message);
  },
);

router.put(
  '/skills',
  checkSchema(userSkillsSchema),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false });
    }
    const { status, ...message } = await addApplicantSkills(
      req.user!.user.basics.id,
      req.body.skills,
      true,
    );
    res.json(message);
  },
);

export default router;
