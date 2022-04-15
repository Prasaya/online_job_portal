import { v4 as uuidv4 } from 'uuid';
import {
  NewJobseekerInput,
  NewJobseekerParameters,
  UpdateJobseekerParameters,
  Skill,
  Jobseeker,
  PublicUser,
  Academics,
} from '@typings/User';
import connection from '@utils/dbSetup';
import { Schema } from 'express-validator';
import hashPassword from '../utils/password';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import logger from '@utils/logger';
import { FieldPacket, RowDataPacket } from 'mysql2';

export const jobseekerRegisterSchema: Schema = {
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
    optional: { options: { checkFalsy: true } },
    isString: true,
    isLength: { options: [{ max: 50 }] },
  },
  middleName: {
    in: ['body'],
    optional: { options: { checkFalsy: true } },
    isString: true,
    isLength: { options: [{ max: 50 }] },
  },
  lastName: {
    in: ['body'],
    optional: { options: { checkFalsy: true } },
    isString: true,
    isLength: { options: [{ max: 50 }] },
  },
  birthday: {
    in: ['body'],
    optional: { options: { checkFalsy: true } },
    isDate: true,
  },
  phone: {
    in: ['body'],
    optional: { options: { checkFalsy: true } },
    isString: true,
    isLength: { options: [{ max: 20 }] },
  },
  gender: {
    in: ['body'],
    optional: { options: { checkFalsy: true } },
    isString: true,
    isLength: { options: [{ max: 20 }] },
  },
};
const jobseekerUpdateSchema: Schema = { ...jobseekerRegisterSchema };
delete jobseekerUpdateSchema.password;
delete jobseekerUpdateSchema.email;
export { jobseekerUpdateSchema };

export const jobseekerSkillsSchema: Schema = {
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

export const jobseekerAcademicsSchema: Schema = {
  academics: {
    in: ['body'],
    isArray: true,
    notEmpty: true,
  },
  // ['academics.*']: {
  //   isInt: true,
  // },
};

export const createJobseeker = async (
  userData: NewJobseekerInput,
): Promise<Jobseeker> => {
  // Order is important; Separate object is created to return id
  const user: NewJobseekerParameters = {
    id: uuidv4(),
    email: userData.email,
    password: await hashPassword(userData.password),
    firstName: userData.firstName,
    middleName: userData.middleName,
    lastName: userData.lastName,
    picture: null,
    birthday: userData.birthday,
    phone: userData.phone,
    gender: userData.gender,
  };
  await connection.execute(
    'CALL createApplicant(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [...Object.values(user)],
  );
  return {
    basics: {
      ...user,
      type: 'Users',
      roles: [],
      socials: [],
      password: null,
    },
    skills: [],
    academics: [],
  };
};

export const updateJobseekerPicture = async (
  userId: string,
  picture: UploadedFile,
) => {
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

export const addJobseekerSkills = async (
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
    //@ts-ignore
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

export const replaceJobseekerSkills = async (
  userId: string,
  skills: Skill | Skill[],
) => {
  await connection.execute('DELETE from applicant_skills where id = ?', [
    userId,
  ]);
  return addJobseekerSkills(userId, skills, false);
};

export const addJobseekerAcademics = async (
  userId: string,
  academics: Academics[],
  replaceIfExists: boolean,
) => {
  try {
    const qids = academics.map((academic) => academic.qid);
    await connection.execute('CALL addApplicantAcademics(?, ?, ?)', [
      userId,
      JSON.stringify(qids),
      replaceIfExists,
    ]);
  } catch (err) {
    logger.error('Error when adding qualification: ', err);
    //@ts-ignore
    switch (err.errno) {
      case 1062: {
        return {
          status: 400,
          message: "You've already added this qualification!",
          success: false,
        };
      }
      case 1452: {
        return {
          status: 400,
          message: 'Invalid qualification!',
          success: false,
        };
      }
      default: {
        return {
          status: 500,
          message: 'Something went wrong!',
          success: false,
        };
      }
    }
  }
  return { status: 200, academics: academics, success: true };
};

export const replaceJobseeerAcademics = async (
  userId: string,
  academics: Academics[],
) => {
  await connection.execute('DELETE from applicant_academics where id = ?', [
    userId,
  ]);
  return addJobseekerAcademics(userId, academics, false);
};

export const applyForJob = async (userId: string, jobId: string) => {
  try {
    await connection.execute('CALL applyForJob(?, ?)', [userId, jobId]);
  } catch (err) {
    logger.error('Error when applying for job: ', err);
    return { status: 500, message: 'Something went wrong!', success: false };
  }
  return {
    status: 200,
    message: 'You have applied for this job!',
    success: true,
  };
};

export const updateJobseeker = async (
  userData: UpdateJobseekerParameters,
): Promise<UpdateJobseekerParameters> => {
  const user: UpdateJobseekerParameters = {
    id: userData.id,
    firstName: userData.firstName,
    middleName: userData.middleName,
    lastName: userData.lastName,
    birthday: userData.birthday,
    phone: userData.phone,
    gender: userData.gender,
  };
  await connection.execute('CALL updateApplicant(?, ?, ?, ?, ?, ?, ?)', [
    ...Object.values(user),
  ]);
  return { ...user };
};

export const getJobseekerById = async (userId: string) => {
  try {
    const [basic_result]: [RowDataPacket[][], FieldPacket[]] =
      await connection.execute(
        'SELECT * FROM applicant_data ' + 'WHERE id = ?',
        [userId],
      );

    const [email_result] = <{ email: string }[][]>(
      (<unknown>(
        await connection.execute('SELECT email FROM auth ' + 'WHERE id = ?', [
          userId,
        ])
      ))
    );
    const [skills_result] = <Skill[][]>(
      (<unknown>(
        await connection.execute(
          'SELECT name, proficiency, experience FROM applicant_skills ' +
            'WHERE id = ?',
          [userId],
        )
      ))
    );

    const [academics_result] = <Academics[][]>(
      (<unknown>(
        await connection.execute(
          'SELECT aq.qid, aq.level, aq.discipline, aq.degree ' +
            'FROM applicant_academics as aa ' +
            'INNER JOIN academic_qualifications as aq ' +
            'ON aa.qid = aq.qid ' +
            'WHERE id = ? ',
          [userId],
        )
      ))
    );

    let user = {
      basics: { ...basic_result[0], email: email_result[0].email },
      skills: skills_result,
      academics: academics_result,
    };
    console.log('academics', academics_result);
    console.log('user', user);
    return user;
  } catch (err) {
    logger.error('Error when applying for job: ', err);
    return '';
  }
};
