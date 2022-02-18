import { isLoggedIn } from '@middleware/authentication';
import { searchUser } from '@models/Auth';
import logger from '@root/utils/logger';
import express, { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { User } from '@typings/User';
import connection from '@utils/dbSetup';
import { isApplicant } from '@middleware/authorization';
import { checkSchema, validationResult } from 'express-validator';
import {
  addApplicantSkills,
  updatePicture,
  userAcademicsSchema,
  userSkillsSchema,
} from '@models/User';

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  res.json({
    user: req.user?.user,
    success: true,
  });
});

router.get('/skills', isApplicant, async (req, res) => {
  const userData = req.user?.user as User;
  res.json({ skills: userData.skills, success: true });
});

router.post(
  '/skills',
  isApplicant,
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
  isApplicant,
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

router.post(
  '/academics',
  isApplicant,
  checkSchema(userAcademicsSchema),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false });
    }
    try {
      await connection.execute('CALL addApplicantAcademics(?, ?)', [
        req.user?.user.basics.id,
        JSON.stringify(req.body.academics),
      ]);
    } catch (err) {
      logger.error('Error when adding skills: ', err);
      if (err.errno === 1062) {
        res.status(400).json({
          message: "You've already added this qualification!",
          success: false,
        });
        return;
      }
      if (err.errno === 1452) {
        res.status(400).json({
          message: 'Invalid qualification!',
          success: false,
        });
        return;
      }
      res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
      return;
    }
    res.json({ skills: req.body.skills, success: true });
  },
);

router.get('/:uid', async (req, res) => {
  const user = await searchUser('Users', req.params.uid);
  if (user === null) {
    return res.status(404).json({
      message: `Could not find user ${req.params.uid}.`,
      success: false,
    });
  }
  const userData = user.basics;
  return res.json({
    id: userData.id,
    email: userData.email,
    type: userData.type,
    firstName: userData.firstName,
    middleName: userData.middleName,
    lastName: userData.lastName,
    picture: userData.picture,
    success: true,
  });
});

router.delete('/:uid', isLoggedIn, async (req, res) => {
  if (req.user?.user.basics.id !== req.params.uid) {
    res
      .status(403)
      .json({ message: 'You cannot delete this user!', success: false });
    return;
  }
  const result = await connection.query('CALL deleteUser(?)', [req.params.uid]);
  res.json({ message: 'User deleted successfully!', result, success: true });
});

export default router;
