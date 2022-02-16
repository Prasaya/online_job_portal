import { Organization } from '@root/typings/Organization';
import { AuthData } from '@typings/authorization';
import { User } from '@typings/User';
import connection from '@utils/dbSetup';
import { RowDataPacket, FieldPacket } from 'mysql2';

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
  const socials = result[0].socials ? JSON.parse(result[0].socials) : [];
  return { ...result[0][0], socials } as AuthData;
};

export async function searchUser(
  userType: 'Users',
  uid: string,
): Promise<User | null>;
export async function searchUser(
  userType: 'Organizations',
  uid: string,
): Promise<Organization | null>;
export async function searchUser(
  userType: string,
  uid: string,
): Promise<User | Organization | null>;
export async function searchUser(
  userType: string,
  id: string,
): Promise<User | Organization | null> {
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
    const user: User = {
      basics: {
        id: data.id,
        email: data.email,
        password: null,
        type: 'Users',
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        picture: data.picture,
        birthday: data.birthday,
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
    const roles = data.roles ? JSON.parse(result[0].roles) : [];
    const socials = data.socials ? JSON.parse(result[0].socials) : [];
    const organization: Organization = {
      basics: {
        id: data.id,
        email: data.email,
        password: null,
        type: 'Organizations',
        roles,
        name: data.name,
        description: data.description,
      },
    };
    return organization;
  }

  throw new Error(`Invalid value for userType ${userType}`);
}
