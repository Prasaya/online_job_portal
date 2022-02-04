import { Role } from './authorization';
import { User as UserModel } from './User';

declare global {
    namespace Express {
        interface User extends UserModel {
            roles?: Role[];
        }
    }

}
