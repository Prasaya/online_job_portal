import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import logger from '../middleware/logger';
import passportSetup from './passportSetup';
import dbConnection from './dbSetup';

var MySQLStore = require('express-mysql-session')(session);

const appSetup = (app: express.Application) => {
    app.use(express.static('./dist/public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const sessionStore = new MySQLStore({}, dbConnection, (err) => {
        if (err) {
            console.error('Error setting up sessionStore', err);
        } else {
            console.log('Session store connected!');
        }
    });
    const cookieMaxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
    const sess = {
        name: 'sessionId',
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: cookieMaxAge,
            secure: app.get('env') === 'production',
            httpOnly: true,
            // sameSite: true,
        },

    };
    app.set('trust proxy', 1);
    if (!process.env.SESSION_SECRET) {
        console.error('No session secret set!');
        process.exit(1);
    }

    app.use(session(sess));

    passportSetup(passport);
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(morgan('combined'));
    app.use(logger);
};

export default appSetup;
