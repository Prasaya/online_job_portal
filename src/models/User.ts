import { v4 as uuidv4 } from 'uuid';
import { AuthUser, AuthUserParameters, DBUser, NewUserInput, User } from '@typings/User';
import connection from '@utils/dbSetup';
import { FieldPacket, RowDataPacket } from 'mysql2';
import { Schema } from 'express-validator';
import hashPassword from '../utils/password';

export const userRegisterSchema: Schema = {
    email: {
        in: ['body'],
        isEmail: true,
        normalizeEmail: true,
        isLength: { options: [{ min: 1, max: 250 }] },
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
    const user: DBUser = {
        uid: uuidv4(),
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
        'INSERT INTO users '
      + '(uid, email, password, firstname, middlename, lastname, picture, birthday, phone, gender) '
      + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [...Object.values(user)],
    );
    return { ...user, socials: [], password: null };
};

export const getAuthUser = async (criteria: AuthUserParameters): Promise<AuthUser | null> => {
    // TODO: Implement socials
    if (criteria.type !== 'email' && criteria.type !== 'uid') {
        return null;
    }
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
        `SELECT * ' +
        'FROM vwAuth ' +
        'WHERE ${criteria.type} = ?`,
        [criteria.criteria],
    );
    if (result.length === 0) {
        return null;
    }
    return { ...result[0] as AuthUser };
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    // TODO: Implement socials
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
        'SELECT * FROM vwUser WHERE email = ?',
        [email],
    );
    if (result.length === 0) {
        return null;
    }
    return { ...result[0] as User };
};

export const getUserByUid = async (uid: string): Promise<User | null> => {
    // TODO: Implement socials
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
        'SELECT * FROM vwUser WHERE uid = ?',
        [uid],
    );
    if (result.length === 0) {
        return null;
    }
    return { ...result[0] as User };
};

export const verifyEmail = async (email: string): Promise<boolean> => {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
        'SELECT uid from vwAuth WHERE email = ?',
        [email],
    );
    return result.length > 0;
};

export const getFederatedCredentials = async (
    provider: string,
    identifier: string,
) => {
    const [result] = await connection.execute(
        'SELECT uid FROM '
      + 'federated_credentials fc INNER JOIN federated_credentials_provider fp '
      + 'ON fc.provider_id = fp.provider_id '
      + 'WHERE fp.provider_name = ? AND fc.identifier = ?',
        [
            provider,
            identifier,
        ],
    );
  type T = { uid: string };
  return result as Array<T>;
};
