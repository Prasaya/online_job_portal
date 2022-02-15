import { v4 as uuidv4 } from 'uuid';
import { NewUserInput, NewUserParameters, User } from '@typings/User';
import connection from '@utils/dbSetup';
import { Schema } from 'express-validator';
import hashPassword from '../utils/password';

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
