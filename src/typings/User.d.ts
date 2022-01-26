import { PartialExcept } from '@typings/utils';

export default interface User {
    uid: string;
    email: string;
    password: string | null;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    picture: string | null;
}

export type NewUserInput = PartialExcept<Omit<User, "uid">, "email">;
export type DBUser = PartialExcept<Omit<User, "email">, "uid">;
