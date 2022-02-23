export type social =
  | {
    provider: string;
    identifier: string;
  }
  | {
    provider: null;
    identifier: null;
  };

export interface Skill {
  name: string;
  experience: number;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Academics {
  qid: number;
  level: string;
  discipline: string;
  degree: string;
}

export interface User {
  basics: {
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
  };
  skills: Skill[];
  academics: Academics[];
}

export interface NewUserParameters
  extends Omit<User['basics'], 'type' | 'roles' | 'socials' | 'password' | 'picture'> {
  password: string;
}

export type NewUserInput = Omit<NewUserParameters, 'id'>;
export type UpdateUser = Omit<NewUserParameters, 'password' | 'email' | 'type'>;
