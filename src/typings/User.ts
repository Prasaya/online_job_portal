export type social =
{
    providerName: string;
    identifier: string;
}
| {
    providerName: null;
    identifier: null;
};

export interface DBUser {
    uid: string;
    role: number;
    email: string;
    password: string | null;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    picture: string | null;
    birthday: Date | null;
    phone: string | null;
    gender: string | null;
}

export interface User extends Omit<DBUser, 'uid' | 'role' | 'password'> {
    id: string;
    role: string;
    password: null;
    socials: social[];
}

export interface NewUserInput extends Omit<DBUser, 'uid' | 'password' | 'role'> {
    password: string;
}
