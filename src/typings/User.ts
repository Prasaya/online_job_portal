export type social =
  | {
      provider: string;
      identifier: string;
    }
  | {
      provider: null;
      identifier: null;
    };

export interface User {
  id: string;
  email: string;
  password: null;
  type: 'Users';
  roles: string[];
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  picture: string | null;
  birthday: Date | null;
  phone: string | null;
  gender: string | null;
  socials: social[];
}

export type NewUserParameters = Omit<User, 'type' | 'roles' | 'socials'>;
export type NewUserInput = Omit<NewUserParameters, 'id'>;
