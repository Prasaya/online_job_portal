import { breakStatement } from '@babel/types';
import { PartialExcept } from '@typings/utils';

export type social =
    {
        providerName: string;
        identifier: string;
    }
    | {
        providerName: null;
        identifier: null;
    };

export interface AuthUser {
    uid: string;
    email: string;
    password: string | null;
    socials?: social[];
}

export type AuthUserParameters = {
    type: "uid" | "email";
    criteria: string;
};
export interface DBUser {
    uid: string;
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

export interface User extends Omit<DBUser, "password"> {
    password: null;
    socials: social[];
}

export interface NewUserInput extends Omit<DBUser, "uid"> {
}
