import { social } from './User';

export interface Organization {
  basics: {
    id: string;
    email: string;
    password: null;
    type: 'Organizations';
    roles: string[];
    name: string;
    description: string | null;
    address: string | null;
    city: string | null;
    website: string | null;
    phone: string | null;
    logo: string | null;
    socials: social[];
  };
}

export interface NewOrganizationParameters
  extends Omit<
    Organization['basics'],
    'type' | 'roles' | 'socials' | 'password'
  > {
  password: string;
}

export type NewOrganizationInput = Omit<NewOrganizationParameters, 'id'>;
