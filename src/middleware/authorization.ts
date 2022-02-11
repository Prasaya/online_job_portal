import { Role } from '@root/typings/authorization';
import roles from '@utils/authorization';
import { Handler } from 'express';

export function roleCallback(cb: (role: Role) => boolean): Handler {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authorization missing', success: false });
        }
        const userRoles = req.user.role;
        const isAuthorized = userRoles?.some((r) => cb(r));
        if (isAuthorized) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden', success: false });
    };
}

export function roleHigherThan(role: string) {
    const reqRoles = roles.filter((r) => r.rName === role)[0];
    return roleCallback((r) => r.roleLevel >= reqRoles.roleLevel);
}

export function roleStrictlyHigherThan(role: string) {
    const reqRoles = roles.filter((r) => r.rName === role)[0];
    return roleCallback((r) => r.roleLevel > reqRoles.roleLevel);
}

export function roleExactly(role: string) {
    return roleCallback((r) => r.roleName === role);
}
