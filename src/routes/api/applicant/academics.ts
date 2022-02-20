import connection from '@utils/dbSetup';
import express, { Request, Response } from 'express';
import { isApplicant } from '@middleware/authorization';
import { userAcademicsSchema } from '@models/User';
import logger from '@utils/logger';
import { checkSchema, validationResult } from 'express-validator';
import { User } from '@typings/User';
import { QueryError } from 'mysql2';

const router = express.Router();

router.get('/', async (req, res) => {
  const userData = req.user?.user as User;
  res.json({ academics: userData.academics, success: true });
});

router.post(
  '/',
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
      const { errno } = err as QueryError;
      logger.error('Error when adding skills: ', err);
      if (errno === 1062) {
        res.status(400).json({
          message: "You've already added this qualification!",
          success: false,
        });
        return;
      }
      if (errno === 1452) {
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

export default router;
