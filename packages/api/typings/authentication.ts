import { social } from './User';

export interface Role {
  roleId: number;
  roleName: string;
  roleLevel: number;
}

enum UserType {
  Jobseeker = 'Users',
  Organization = 'Organizations',
}
export interface AuthData {
  id: string;
  email: string;
  password?: string;
  type: UserType;
  socials: social[];
}
