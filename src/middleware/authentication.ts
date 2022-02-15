import { Handler } from 'express';

export const isLoggedIn: Handler = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: 'Missing credentials!', success: false });
};

export const isNotLoggedIn: Handler = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: 'Missing credentials!', success: false });
};
