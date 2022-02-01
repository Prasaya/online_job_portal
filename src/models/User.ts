import { v4 as uuidv4 } from 'uuid';
import User, { NewUserInput, DBUser } from '@typings/User';
import hashPassword from '../utils/password';
import connection from '@utils/dbSetup';
import { RowDataPacket } from 'mysql2';
import { getRoleByName } from '@root/utils/authorization';

const userDataJoin = '' +
    'users u ' +
    'INNER JOIN emails e ON u.uid = e.uid' +
    'INNER JOIN roles r ON u.role = r.role';

export const createNewUser = async (userData: NewUserInput): Promise<User> => {
    const user = {
        uid: uuidv4(),
        email: userData.email,
        password: await hashPassword(userData.password),
        firstName: userData.firstName || null,
        middleName: userData.middleName || null,
        lastName: userData.lastName || null,
        picture: userData.picture || null,
    };
    await connection.execute( 
        'INSERT INTO users ' +
        '(uid, email, password, firstname, middlename, lastname, picture) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?)',
        [...Object.values(user)]
    );
    return { ...user, password: null }; 
};

export const getUserByEmail = async (email: string, includePassword: boolean = false): Promise<DBUser | null> => {
    const [result] = await connection.execute(
        'SELECT * ' +
        'FROM vwAuth ' +
        'WHERE email = ?',
        [email]
    );
    if ((result as RowDataPacket[]).length === 0) {
        return null;
    }
    const password = includePassword ? (result as RowDataPacket[])[0].password : null;
    return { ...(result[0] as DBUser), password };
};

export const getUserByUid = async (uid: string, includePassword: boolean = false): Promise<DBUser | null> => {
    const [result] = await connection.query(
        'SELECT * ' +
        'FROM vwAuth ' +
        'WHERE uid = ?',
        [uid]
    );
    if ((result as RowDataPacket[]).length === 0) {
        return null;
    }
    const password = includePassword ? (result as RowDataPacket[])[0].password : null;
    return { ...(result[0] as DBUser), password };
};

export const verifyEmail = async (email: string): Promise<Boolean> => {
    const [result] = await connection.execute(
        'SELECT uid from vwAuth WHERE email = ?',
        [email]
    );
    return (result as RowDataPacket[]).length > 0;
};

export const getFederatedCredentials = async (provider, identifier) => {
    const [result] = await connection.execute(
        'SELECT uid FROM ' +
        'federated_credentials fc INNER JOIN federated_credentials_provider fp ' +
        'ON fc.provider_id = fp.provider_id ' +
        'WHERE fp.provider_name = ? AND fc.identifier = ?',
        [provider, identifier]
    );
    type T = { uid: string; };
    return result as Array<T>;
};
