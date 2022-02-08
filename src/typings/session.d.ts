import { session } from 'passport';

declare module 'express-session' {
    interface SessionData {
        views: number;
        messages: Array<unknown>;
    }
}

export default session;
