import { Role } from '@root/typings/authorization';

const roles: Role[] = [
    {
        rId: 1,
        rName: 'admin',
        rLevel: 1,
    },
    {
        rId: 2,
        rName: 'employee',
        rLevel: 2,
    },
    {
        rId: 3,
        rName: 'applicant',
        rLevel: 2,
    },

];

export function getRoleById(id: number): Role | null {
    return roles.find((role) => {
        return role.rId === id;
    }) || null;
}

export function getRoleByName(name: string): Role | null {
    return roles.find((role) => {
        return role.rName === name;
    }) || null;
}

export default roles;
