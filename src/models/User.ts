import { v4 as uuidv4 } from 'uuid';
import User, { NewUserInput, DBUser } from '@typings/User';
import hashPassword from '../utils/password';
import connection from '@utils/dbSetup';
import { RowDataPacket } from 'mysql2';

export const createNewUser = async (userData: NewUserInput): Promise<User> => {
    const user: DBUser = {
        uid: uuidv4(),
        password: await hashPassword(userData.password),
        firstName: userData.firstName || null,
        middleName: userData.middleName || null,
        lastName: userData.lastName || null,
        picture: userData.picture || null,
    };
    await connection.execute(
        'INSERT INTO users ' +
        '(uid, password, firstname, middlename, lastname, picture) ' +
        'VALUES (?, ?, ?, ?, ?, ?)',
        [...Object.values(user)]
    );
    await connection.execute(
        'INSERT INTO emails ' +
        '(uid, email) ' +
        'VALUES (?, ?)',
        [user.uid, userData.email]
    );
    return { ...<User>user, email: userData.email };
};

export const getUserByEmail = async (email: string): Promise<Array<User>> => {
    'SELECT * ';
    const [result] = await connection.query(
        'SELECT * FROM users INNER JOIN emails on emails.uid = users.uid ' +
        'WHERE email = ?',
        [email]
    );
    return result as Array<User>;
};

export const getUserByUid = async (uid: string): Promise<Array<User>> => {
    const [result] = await connection.query(
        'SELECT * FROM users INNER JOIN emails on emails.uid = users.uid ' +
        'WHERE users.uid = ?',
        [uid]
    );
    return result as Array<User>;
};

export const verifyEmail = async (email: string): Promise<Boolean> => {
    const [result] = await connection.execute(
        'SELECT uid from emails WHERE email = ?',
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
