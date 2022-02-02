import { Role } from '@typings/authorization';
import roles from '@utils/authorization';

export function roleCallback(cb: (role: Role) => boolean) {
    return (req, res, next) => {
        const userRoles = req.user.roles;
        userRoles.forEach(r => {
            if (cb(r)) {
                return next();
            }
        });
        res.status(403).json({ message: 'Forbidden', success: false });
    };
}

export function roleHigherThan(role: string) {
    const reqRoles = roles.filter(r => r.rName === role)[0];
    return roleCallback(r => r.rLevel >= reqRoles.rLevel);
}

export function roleStrictlyHigherThan(role: string) {
    const reqRoles = roles.filter(r => r.rName === role)[0];
    return roleCallback(r => r.rLevel > reqRoles.rLevel);
}

export function roleExactly(role: string) {
    return roleCallback(r => r.rName === role);
}
