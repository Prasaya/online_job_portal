import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import logger from '@utils/logger';
import { getAuthUser, searchUser } from '@root/models/Auth';
import { verifyPassword } from './password';

const passportConfigure = (passportInstance: passport.Authenticator) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error('Google client id or secret is not set');
    }
    passportInstance.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
            state: true,
        },
        async (accessToken, refreshToken, profile, cb) => cb(
            null,
        ),
    ));

    passportInstance.use(new LocalStrategy(async (email, password, cb) => {
        try {
            const invalidDataPrompt = 'Incorrect username or password';
            const userData = await getAuthUser(email);
            if (userData === null) {
                return cb(
                    null,
                    false,
                    { message: invalidDataPrompt },
                );
            }
            const passwordMatches = await verifyPassword(
                password,
                userData.password || null,
            );
            if (!passwordMatches) {
                return cb(
                    null,
                    false,
                    { message: invalidDataPrompt },
                );
            }
            const user = await searchUser(
                userData.role,
                userData.id,
            );
            if (user === null) {
                return cb(
                    null,
                    false,
                    { message: 'Could not find user data!' },
                );
            }
            return cb(
                null,
                { basics: user },
            );
        } catch (err) {
            logger.error(`Error in local login: ${err}`);
            return cb(err);
        }
    }));

    passportInstance.serializeUser((data, cb) => {
        const { basics: user } = data;
        const { id, role } = user;
        cb(
            null,
            { id, role },
        );
    });

    passportInstance.deserializeUser(async (obj: {id: string, role: string}, cb) => {
        try {
            if (!obj) {
                return cb(
                    null,
                    null,
                );
            }
            const userData = await searchUser(
                obj.role,
                obj.id,
            );
            if (userData === null) {
                return cb(
                    null,
                    false,
                );
            }
            return cb(
                null,
                { basics: userData },
            );
        } catch (err) {
            logger.error(`Error in quering database: deserializeUser: ${err}`);
            return cb(
                err,
                null,
            );
        }
    });
};

export default passportConfigure;
