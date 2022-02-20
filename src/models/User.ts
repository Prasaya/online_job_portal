import { v4 as uuidv4 } from 'uuid';
import { NewUserInput, NewUserParameters, Skill, User } from '@typings/User';
import connection from '@utils/dbSetup';
import { Schema } from 'express-validator';
import hashPassword from '../utils/password';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import logger from '@utils/logger';

export const userRegisterSchema: Schema = {
  email: {
    in: ['body'],
    isEmail: true,
    normalizeEmail: true,
    isLength: { options: [{ min: 1, max: 255 }] },
  },
  password: {
    in: ['body'],
    isStrongPassword: {
      options: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
      },
    },
  },
  firstName: {
    in: ['body'],
    optional: true,
    isString: true,
    isLength: { options: [{ max: 50 }] },
  },
  middleName: {
    in: ['body'],
    optional: true,
    isString: true,
    isLength: { options: [{ max: 50 }] },
  },
  lastName: {
    in: ['body'],
    optional: true,
    isString: true,
    isLength: { options: [{ max: 50 }] },
  },
  birthday: {
    in: ['body'],
    optional: true,
    isDate: true,
  },
  phone: {
    in: ['body'],
    optional: true,
    isString: true,
    isLength: { options: [{ max: 20 }] },
  },
  gender: {
    in: ['body'],
    optional: true,
    isString: true,
    isLength: { options: [{ max: 10 }] },
  },
};

export const userSkillsSchema: Schema = {
  skills: {
    in: ['body'],
    isArray: true,
    notEmpty: true,
  },
  ['skills.*']: {
    isObject: true,
  },
  ['skills.*.name']: {
    isString: true,
    isLength: { options: [{ max: 100 }] },
  },
  ['skills.*.proficiency']: {
    isString: true,
    isIn: { options: [['Beginner', 'Intermediate', 'Advanced', 'Expert']] },
  },
  ['skills.*.experience']: {
    isInt: { options: { min: 0, max: 100 } },
  },
};

export const userAcademicsSchema: Schema = {
  academics: {
    in: ['body'],
    isArray: true,
    notEmpty: true,
  },
  ['academics.*']: {
    isInt: true,
  },
};

export const createNewUser = async (userData: NewUserInput): Promise<User> => {
  const user: NewUserParameters = {
    id: uuidv4(),
    email: userData.email,
    password: await hashPassword(userData.password),
    firstName: userData.firstName,
    middleName: userData.middleName,
    lastName: userData.lastName,
    picture: userData.picture,
    birthday: userData.birthday,
    phone: userData.phone,
    gender: userData.gender,
  };
  await connection.execute(
    'CALL createApplicant(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [...Object.values(user)],
  );
  return { ...user, type: 'Users', roles: [], socials: [], password: null };
};

export const updatePicture = async (userId: string, picture: UploadedFile) => {
  try {
    const fileName = userId + path.extname(picture.name);
    await picture.mv(path.resolve('.', 'images', fileName));
    await connection.query(
      'UPDATE applicant_data SET picture = ? WHERE id = ?',
      [fileName, userId],
    );
    return {
      name: picture.name,
      size: picture.size,
      encoding: picture.encoding,
      mimetype: picture.mimetype,
      truncated: picture.truncated,
      url: fileName,
    };
  } catch (err) {
    logger.error(err);
    return { message: 'Something went wrong!', success: false };
  }
};

export const addApplicantSkills = async (
  userId: string,
  skills: Skill | Skill[],
  replaceIfExists: boolean,
) => {
  const toAdd = Array.isArray(skills) ? skills : [skills];
  try {
    await connection.execute('CALL addApplicantSkills(?, ?, ?)', [
      userId,
      JSON.stringify(toAdd),
      replaceIfExists,
    ]);
  } catch (err) {
    logger.error('Error when adding skills: ', err);
    if (err.errno === 1062) {
      return {
        status: 400,
        message: "You've already added this skill!",
        success: false,
      };
    }
    return { status: 500, message: 'Something went wrong!', success: false };
  }
  return { status: 200, skills: toAdd, success: true };
};
