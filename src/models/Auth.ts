import { Organization } from '@root/typings/Organization';
import logger from '@root/utils/logger';
import { AuthData } from '@typings/authorization';
import { User } from '@typings/User';
import connection from '@utils/dbSetup';
import { RowDataPacket, FieldPacket } from 'mysql2';

export const getAuthUser = async (email: string): Promise<AuthData | null> => {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.query(
        'CALL getAuthDetails(?)',
        [email],
    );
    if (!Array.isArray(result) || !Array.isArray(result[0]) || result[0].length === 0) {
        return null;
    }
    const socials = result[0].socials
        ? JSON.parse(result[0].socials)
        : [];
    return { ...result[0][0], socials } as AuthData;
};

export async function searchUser(userType: 'Users', uid: string) :Promise<User | null>;
export async function searchUser(userType: 'Organizations', uid: string) :Promise<Organization | null>;
export async function searchUser(userType: string, uid: string): Promise<User | Organization | null>;
export async function searchUser(
    userType: string,
    id: string,
): Promise<User | Organization | null> {
    if (!id) {
        throw new Error("You must provide either 'uid' or 'email'");
    }
    if (userType === 'Users') {
        const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
            'CALL getUserData(?)',
            [id],
        );
        if (!Array.isArray(result) || !Array.isArray(result[0]) || result[0][0].length === 0) {
            return null;
        }
        const socials = result[0].socials
            ? JSON.parse(result[0].socials)
            : [];
        return { ...result[0][0], socials } as User;
    }
    if (userType === 'Organizations') {
        const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
            'CALL getOrganizationData(?)',
            [id],
        );
        if (result.length === 0) {
            return null;
        }
        return { ...result[0][0] } as Organization;
    }

    throw new Error(`Invalid value for userType ${userType}`);
}
