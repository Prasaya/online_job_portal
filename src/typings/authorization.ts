import { social } from './User';

export interface Role {
    roleId: number;
    roleName: string;
    roleLevel: number;
}

export interface AuthData {
    id: string;
    email: string;
    password?: string;
    role: string;
    socials: social[];
}
