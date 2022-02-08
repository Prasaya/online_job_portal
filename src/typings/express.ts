import { Role } from './authorization';
import { User as UserModel } from './User';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface User extends UserModel {
            roles?: Role[];
        }
    }

}
