import { v4 as uuidv4 } from "uuid";
import {
  User,
  NewUserInput,
  DBUser,
  AuthUserParameters,
  AuthUser,
} from "@typings/User";
import hashPassword from "../utils/password";
import connection from "@utils/dbSetup";
import { FieldPacket, RowDataPacket } from "mysql2";

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
    gender: userData.gender    
   };
  console.log(user);
  await connection.execute(
    "INSERT INTO users " +
      "(uid, email, password, firstname, middlename, lastname, picture, birthday, phone, gender) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [...Object.values(user)]
  );
  return { ...user, socials: [], password: null };
};

export const getAuthUser = async (
  criteria: AuthUserParameters
): Promise<AuthUser | null> => {
  // TODO: Implement socials
  if (criteria.type !== "email" && criteria.type !== "uid") {
    return null;
  }
  const [result, fields]: [RowDataPacket[], FieldPacket[]] =
    await connection.execute(
      `SELECT * ' +
        'FROM vwAuth ' +
        'WHERE ${criteria.type} = ?`,
      [criteria.criteria]
    );
  if (result.length === 0) {
    return null;
  }
  return { ...(result[0] as AuthUser) };
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  // TODO: Implement socials
  const [result, fields]: [RowDataPacket[], FieldPacket[]] =
    await connection.execute("SELECT * " + "FROM vwUser " + "WHERE email = ?", [
      email,
    ]);
  if (result.length === 0) {
    return null;
  }
  return { ...(result[0] as User) };
};

export const getUserByUid = async (uid: string): Promise<User | null> => {
  // TODO: Implement socials
  const [result, fields]: [RowDataPacket[], FieldPacket[]] =
    await connection.execute("SELECT * " + "FROM vwUser " + "WHERE uid = ?", [
      uid,
    ]);
  if (result.length === 0) {
    return null;
  }
  return { ...(result[0] as User) };
};

export const verifyEmail = async (email: string): Promise<Boolean> => {
  const [result] = await connection.execute(
    "SELECT uid from vwAuth WHERE email = ?",
    [email]
  );
  return (result as RowDataPacket[]).length > 0;
};

export const getFederatedCredentials = async (
  provider: string,
  identifier: string
) => {
  const [result] = await connection.execute(
    "SELECT uid FROM " +
      "federated_credentials fc INNER JOIN federated_credentials_provider fp " +
      "ON fc.provider_id = fp.provider_id " +
      "WHERE fp.provider_name = ? AND fc.identifier = ?",
    [provider, identifier]
  );
  type T = { uid: string };
  return result as Array<T>;
};
