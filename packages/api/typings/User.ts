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

export interface Jobseeker {
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
    birthday: string | null;
    phone: string | null;
    gender: string | null;
    socials: social[];
  };
  skills: Skill[];
  academics: Academics[];
}

export interface NewJobseekerParameters
  extends Omit<
    Jobseeker['basics'],
    'type' | 'roles' | 'socials' | 'password' | 'picture'
  > {
  picture: null;
  password: string;
}

export type NewJobseekerInput = Omit<NewJobseekerParameters, 'id' | 'picture'>;
export type UpdateJobseekerParameters = Omit<
  NewJobseekerParameters,
  'password' | 'email' | 'type' | 'picture'
>;

export interface PublicUser {
  basics: {
    id: string;
    email: string;
    firstName: string;
    middleName: string | null;
    lastName: string | null;
    picture: string | null;
    birthday: string | null;
    phone: string | null;
    gender: string | null;
  };
  skills: Skill[];
  academics: string[];
}
