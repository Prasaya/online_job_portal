import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import logger from '@utils/logger';
import mysqlSession from 'express-mysql-session';
import viewCounter from '@middleware/viewCounter';
import passportSetup from './passportSetup';
import dbConnection from './dbSetup';

const MySQLStore = mysqlSession(session);

const appSetup = (app: express.Application) => {
  app.use(express.static('./dist/public'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const sessionStore = new MySQLStore({}, dbConnection, (err) => {
    if (err) {
      logger.error(`Error setting up sessionStore: ${err}`);
    } else {
      logger.info('Session store connected!');
    }
  });
  const cookieMaxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
  if (!process.env.SESSION_SECRET) {
    logger.error('No session secret set!');
    process.exit(1);
  }
  const sess = {
    name: 'sessionId',
    secret: process.env.SESSION_SECRET,
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

  passportSetup(passport);
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(morgan('combined'));
  app.use(viewCounter);
};

export default appSetup;
