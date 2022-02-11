export interface DBOrganization {
    oid: string;
    role: number;
    email: string;
    password: string;
    name: string;
    description: string | null;
    address: string | null;
    city: string | null;
    website: string | null;
    phone: string | null;
    logo: string | null;
}

export interface Organization extends Omit<DBOrganization, 'oid' | 'role' | 'password'> {
    id: string;
    role: string;
    password: null;
}

export interface NewOrganizationInput extends Omit<DBOrganization, 'oid' | 'role'> {
    password: string;
}
