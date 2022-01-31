import { PartialExcept } from '@typings/utils';

export default interface User {
    uid: string;
    email: string;
    roleName: string;
    password: string | null;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    picture: string | null;
}

export type NewUserInput = PartialExcept<Omit<User, "uid">, "email" | "roleName">;
export interface DBUser extends User {
    roleId: number;
}




