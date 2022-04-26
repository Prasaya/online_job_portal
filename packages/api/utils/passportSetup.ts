import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import logger from '@utils/logger';
import { getAuthUser, searchUser } from '@models/Auth';
import { verifyPassword } from './password';
import { getEnv } from '@root/services/Configuration/env';
import { IDatabaseService } from '@root/services/DatabaseService/typings';

const passportConfigure = (
  passportInstance: passport.Authenticator,
  dbService: IDatabaseService,
) => {
  passportInstance.use(
    new GoogleStrategy(
      {
        clientID: getEnv('GOOGLE_CLIENT_ID'),
        clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
        callbackURL: '/api/auth/google/callback',
        state: true,
      },
      async (accessToken, refreshToken, profile, cb) => cb(null),
    ),
  );

  passportInstance.use(
    new LocalStrategy(async (email, password, cb) => {
      try {
        const invalidDataPrompt = 'Incorrect username or password';
        const userData = await getAuthUser(dbService, email);
        if (userData === null) {
          return cb(null, false, { message: invalidDataPrompt });
        }
        const passwordMatches = await verifyPassword(
          password,
          userData.password || null,
        );
        if (!passwordMatches) {
          return cb(null, false, { message: invalidDataPrompt });
        }
        const user = await searchUser(dbService, userData.type, userData.id);
        if (user === null) {
          return cb(null, false, { message: 'Could not find user data!' });
        }
        return cb(null, { user });
      } catch (err) {
        logger.error(`Error in local login: ${err}`);
        return cb(err);
      }
    }),
  );

  passportInstance.serializeUser((data, cb) => {
    const { user } = data;
    const { id, type } = user.basics;
    cb(null, { id, type });
  });

  passportInstance.deserializeUser(
    async (obj: { id: string; type: 'Users' | 'Organizations' }, cb) => {
      try {
        if (!obj) {
          return cb(null, null);
        }
        const userData = await searchUser(dbService, obj.type, obj.id);
        if (userData === null) {
          return cb(null, false);
        }
        return cb(null, { user: userData });
      } catch (err) {
        logger.error(`Error in quering database: deserializeUser: ${err}`);
        return cb(err, null);
      }
    },
  );
};

export default passportConfigure;
