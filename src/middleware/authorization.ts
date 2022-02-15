import { Role } from '@root/typings/authorization';
import roles, { getRoleByName } from '@utils/authorization';
import { Handler } from 'express';

export function roleCallback(cb: (role: Role) => boolean): Handler {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authorization missing', success: false });
        }
        const userRoles: Role[] = [];
        req.user.basics.roles.forEach(async (roleName) => {
            const role = await getRoleByName(roleName);
            if (role) {
                userRoles.push(role);
            }
        });
        const isAuthorized = userRoles?.some((r) => cb(r));
        if (isAuthorized) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden', success: false });
    };
}

export function roleHigherThan(role: string) {
    const reqRoles = roles.filter((r) => r.roleName === role)[0];
    return roleCallback((r) => r.roleLevel >= reqRoles.roleLevel);
}

export function roleStrictlyHigherThan(role: string) {
    const reqRoles = roles.filter((r) => r.roleName === role)[0];
    return roleCallback((r) => r.roleLevel > reqRoles.roleLevel);
}

export function roleExactly(role: string) {
    return roleCallback((r) => r.roleName === role);
}

export const isApplicant: Handler = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: 'Missing credentials!', success: false });
        return;
    }
    if (req.user.basics.type !== 'Users') {
        res.status(403).json({ message: 'Must be logged in as User!', success: false });
        return;
    }
    next();
};

export const isOrganization: Handler = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: 'Missing credentials!', success: false });
        return;
    }
    if (req.user.basics.type !== 'Organizations') {
        res.status(403).json({ message: 'Must be logged in as User!', success: false });
        return;
    }
    next();
};
