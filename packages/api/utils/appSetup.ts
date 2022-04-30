import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import logger from '@utils/logger';
import passportSetup from './passportSetup';
import { getEnv } from '@root/services/Configuration/env';
import { databaseService } from '@root/services/bootstrap';
const session = require('express-session');
import mySQLSessionStore from 'express-mysql-session';

const MySQLStore = mySQLSessionStore(session);

const appSetup = (app: express.Application): void => {
  app.locals.dbService = databaseService;
  app.use(express.static('./dist/public'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const sessionStore = new MySQLStore(
    {},
    databaseService.getConnectionPool(),
    (err: any) => {
      if (err) {
        logger.error(`Error setting up sessionStore: ${err}`);
        throw err;
      } else {
        logger.info('Session store connected!');
      }
    },
  );
  const cookieMaxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
  const sess = {
    name: 'sessionId',
    secret: getEnv('SESSION_SECRET'),
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

  app.use(session(sess));

  passportSetup(passport, databaseService);
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(morgan('combined'));
};

export default appSetup;
