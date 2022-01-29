import { Handler, Request } from 'express';

const isLoggedIn: Handler = (req: Request, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Access Denied', success: false });
};

export default isLoggedIn;
