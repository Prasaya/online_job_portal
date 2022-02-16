import { isLoggedIn } from '@root/middleware/authentication';
import { searchUser } from '@root/models/Auth';
import logger from '@root/utils/logger';
import express, { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { User } from '@typings/User';
import connection from '@utils/dbSetup';
import { isApplicant } from '@root/middleware/authorization';
import { checkSchema, validationResult } from 'express-validator';
import { userAcademicsSchema, userSkillsSchema } from '@root/models/User';

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  res.json({
    user: req.user?.user,
    success: true,
  });
});

router.get('/avatar', isApplicant, (req, res) => {
  const userData = req.user?.user as User;
  const fileName = userData.basics.picture;
  if (!fileName) {
    res.status(400).json({ message: 'No avatar found!', success: false });
    return;
  }
  res.sendFile(path.resolve('.', 'images', fileName));
});

router.post(
  '/avatar',
  isApplicant,
  fileUpload({
    createParentPath: true,
    debug: false,
    limits: { fileSize: 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
  async (req, res) => {
    if (!req.files || !req.files.avatar) {
      res
        .status(400)
        .json({ message: 'No files were uploaded!', success: false });
      return;
    }
    const file = req.files.avatar as fileUpload.UploadedFile;
    try {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const fileName = req.user?.user.basics.id + path.extname(file.name);
      await file.mv(path.resolve('.', 'images', fileName));
      await connection.query('UPDATE users SET picture = ? WHERE uid = ?', [
        fileName,
        req.user?.user.basics.id,
      ]);
      res.json({
        name: file.name,
        size: file.size,
        encoding: file.encoding,
        mimetype: file.mimetype,
        truncated: file.truncated,
        url: fileName,
      });
    } catch (err) {
      logger.error(err);
      res
        .status(500)
        .json({ message: 'Something went wrong!', success: false });
    }
  },
);

router.post(
  '/skills',
  isApplicant,
  checkSchema(userSkillsSchema),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false });
    }
    try {
      await connection.execute('CALL addApplicantSkills(?, ?)', [
        req.user?.user.basics.id,
        JSON.stringify(req.body.skills),
      ]);
    } catch (err) {
      logger.error('Error when adding skills: ', err);
      if (err.errno === 1062) {
        res.status(400).json({
          message: "You've already added this skill!",
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
