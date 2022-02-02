import { session } from 'passport';

declare module 'express-session' {
    interface SessionData {
        views: number;
        messages: Array<any>;
    }
}

export { session };
