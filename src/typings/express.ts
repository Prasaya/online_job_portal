import { Organization } from './Organization';
import { User as UserData } from './User';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      basics: UserData | Organization;
    }
  }
}
