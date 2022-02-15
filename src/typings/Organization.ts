import { social } from './User';

export interface Organization {
  id: string;
  email: string;
  password: string;
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
}

export type NewOrganizationParameters = Omit<
  Organization,
  'type' | 'roles' | 'socials'
>;
export type NewOrganizationInput = Omit<NewOrganizationParameters, 'id'>;
