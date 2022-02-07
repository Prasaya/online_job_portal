import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import {
    User, NewUserInput
} from '@typings/User';
import {
    createNewUser, getAuthUser, getFederatedCredentials, getUserByEmail, getUserByUid
} from '../models/User';
import { verifyPassword } from './password';
import connection from '@utils/dbSetup';
import passport from 'passport';
import logger from '@utils/logger';

const passportConfigure = (passport: passport.Authenticator) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error('Google client id or secret is not set');
    }
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
            state: true,
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const providerData = await getFederatedCredentials('google', profile.id);
                let user: User;
                if (providerData.length === 0) {
                    const emails = profile.emails;
                    if (emails) {
                        const userData = await getUserByEmail(emails[0].value);
                        if (userData === null) {
                            let names;
                            if (profile.name) {
                                names = {
                                    firstName: profile.name.givenName,
                                    middleName: profile.name.middleName || null,
                                    lastName: profile.name.familyName,
                                };
                            } else {
                                names = {
                                    firstName: null,
                                    middleName: null,
                                    lastName: null,
                                };
                            }
                            const newUser: NewUserInput = {
                                // TODO: Get user birthday and gender from google
                                email: emails[0].value,
                                password: null,
                                ...names,
                                picture: profile.photos ? profile.photos[0].value : null,
                                birthday: null,
                                phone: null,
                                gender: null,
                            };
                            user = await createNewUser(newUser);
                        } else {
                            user = userData;
                        }
                    } else {
                        throw new Error(`Something unexpected happened!
                            User ${profile} has no email!`);
                    }
                    await connection.execute(
                        'INSERT INTO federated_credentials ' +
                        '(uid, provider, identifier) ' +
                        'VALUES (?, ?, ?)',
                        [
                            user.uid,
                            'google',
                            profile.id,
                        ]
                    );
                } else {
                    const temp = await getUserByUid(providerData[0].uid);
                    if (temp === null) {
                        throw new Error(`User ${profile} is present in
                        federatedCredentials but not in Users!`);
                    }
                    user = temp;
                }
                return cb(null, user);
            } catch (err) {
                logger.error(`Error in quering database: ${err}`);
                return cb(err as string | Error | null | undefined);
            }
        }
    ));

    passport.use(new LocalStrategy(async (email, password, cb) => {
        try {
            const invalidDataPrompt = 'Incorrect username or password';
            const userData = await getAuthUser({
                type: 'email', criteria: email,
            });
            if (userData === null) {
                return cb(null, false, { message: invalidDataPrompt });
            }
            const passwordMatches = await verifyPassword(password, userData.password);
            if (!passwordMatches) {
                return cb(null, false, { message: invalidDataPrompt });
            }
            const user = await getUserByUid(userData.uid);
            return cb(null, user);
        } catch (err) {
            logger.error(`Error in local login: ${err}`);
            return cb(err, null);
        }
    }));

    passport.serializeUser((user, cb) => {
        cb(null, user.uid);
    });

    passport.deserializeUser(async (obj: string | null | undefined, cb) => {
        try {
            if (!obj) {
                return cb(null, null);
            }
            const userData = await getUserByUid(obj);
            cb(null, userData);
        } catch (err) {
            logger.error(`Error in quering database: deserializeUser: ${err}`);
            return cb(err, null);
        }
    });
};

export default passportConfigure;
