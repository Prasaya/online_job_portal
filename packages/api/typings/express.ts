import { Organization } from './Organization';
import { Jobseeker as UserData } from './User';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      user: UserData | Organization;
    }
  }
}
