import { Organization } from '@typings/Organization';
import { AuthData } from '@typings/authentication';
import { Jobseeker } from '@typings/User';
import connection from '@utils/dbSetup';
import { RowDataPacket, FieldPacket } from 'mysql2';
import { formatDate } from '@utils/date';
import { Schema } from 'express-validator';
import hashPassword from '@utils/password';

export const updateUserSchema: Schema = {
  email: {
    in: ['body'],
    isEmail: true,
    normalizeEmail: true,
    optional: { options: { checkFalsy: true } },
    isLength: { options: [{ min: 1, max: 255 }] },
  },
  password: {
    in: ['body'],
    optional: { options: { checkFalsy: true } },
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
};

export const getAuthUser = async (email: string): Promise<AuthData | null> => {
  const [result]: [RowDataPacket[], FieldPacket[]] = await connection.query(
    'CALL getAuthDetails(?)',
    [email],
  );
  if (
    !Array.isArray(result) ||
    !Array.isArray(result[0]) ||
    result[0].length === 0
  ) {
    return null;
  }
  const socials = result[0].socials || [];
  return { ...result[0][0], socials } as AuthData;
};

export async function searchUser(
  userType: 'Users',
  uid: string,
): Promise<Jobseeker | null>;
export async function searchUser(
  userType: 'Organizations',
  uid: string,
): Promise<Organization | null>;
export async function searchUser(
  userType: string,
  uid: string,
): Promise<Jobseeker | Organization | null>;
export async function searchUser(
  userType: string,
  id: string,
): Promise<Jobseeker | Organization | null> {
  if (!id) {
    throw new Error('You must provide either id.');
  }
  if (userType === 'Users') {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'CALL getUserData(?)',
      [id],
    );
    if (
      !Array.isArray(result) ||
      !Array.isArray(result[0]) ||
      result[0].length === 0
    ) {
      return null;
    }
    const data = result[0][0];
    const roles = data.roles ? data.roles : [];
    const socials = data.socials ? data.socials : [];
    const skills = data.skills ? data.skills : [];
    const academics = data.academics ? data.academics : [];
    const birthday = formatDate(data.birthday);

    const user: Jobseeker = {
      basics: {
        id: data.id,
        email: data.email,
        password: null,
        type: 'Users',
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        picture: data.picture,
        birthday,
        phone: data.phone,
        gender: data.gender,
        roles,
        socials,
      },
      skills,
      academics,
    };
    return user;
  }
  if (userType === 'Organizations') {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'CALL getOrganizationData(?)',
      [id],
    );
    if (
      !Array.isArray(result) ||
      !Array.isArray(result[0]) ||
      result[0].length === 0
    ) {
      return null;
    }
    const data = result[0][0];
    const roles = data.roles ? result[0].roles : [];
    const socials = data.socials ? result[0].socials : [];
    const organization: Organization = {
      basics: {
        id: data.id,
        email: data.email,
        password: null,
        type: 'Organizations',
        roles,
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        website: data.website,
        phone: data.phone,
        logo: data.logo,
        socials,
      },
    };
    return organization;
  }

  throw new Error(`Invalid value for userType ${userType}`);
}

export async function modifyUser(id: string, email: string, password: string) {
  const hashed = (await hashPassword(password)) || null;
  await connection.query('CALL updateAuthData(?, ?, ?)', [
    id,
    email || null,
    hashed,
  ]);
}
