import { v4 as uuidv4 } from 'uuid';
import { Schema } from 'express-validator';
import { Organization, NewOrganizationInput, NewOrganizationParameters } from '@root/typings/Organization';
import connection from '@utils/dbSetup';
import hashPassword from '@root/utils/password';

export const organizationRegisterSchema: Schema = {
    email: {
        in: ['body'],
        isEmail: true,
        normalizeEmail: true,
        isLength: { options: [{ min: 1, max: 255 }] },
    },
    password: {
        in: ['body'],
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
                returnScore: false,
                pointsPerUnique: 1,
                pointsPerRepeat: 0.5,
                pointsForContainingLower: 10,
                pointsForContainingUpper: 10,
                pointsForContainingNumber: 10,
                pointsForContainingSymbol: 10,
            },
        },
    },
    name: {
        in: ['body'],
        optional: true,
        isString: true,
        isLength: { options: [{ max: 100 }] },
    },
    description: {
        in: ['body'],
        optional: true,
        isString: true,
        isLength: { options: [{ max: 5000 }] },
    },
    address: {
        in: ['body'],
        optional: true,
        isString: true,
        isLength: { options: [{ max: 200 }] },
    },
    city: {
        in: ['body'],
        optional: true,
        isString: true,
        isLength: { options: [{ max: 100 }] },
    },
    website: {
        in: ['body'],
        optional: true,
        isString: true,
        isLength: { options: [{ max: 200 }] },
    },
    phone: {
        in: ['body'],
        optional: true,
        isString: true,
        isLength: { options: [{ max: 20 }] },
    },
    logo: {
        in: ['body'],
        optional: true,
        isString: true,
        isLength: { options: [{ max: 200 }] },
    },
};

export const createNewOrganization = async (organizationData: NewOrganizationInput): Promise<Organization> => {
    const hashedPassword = await hashPassword(organizationData.password);
    if (!hashPassword) {
        throw new Error('Hashed password is null!');
    }
    const organization: NewOrganizationParameters = {
        id: uuidv4(),
        email: organizationData.email,
        password: hashedPassword,
        name: `${organizationData.name}`,
        description: organizationData.description,
        address: organizationData.address,
        city: organizationData.city,
        website: organizationData.website,
        phone: organizationData.phone,
        logo: organizationData.logo,
    };
    await connection.execute(
        'CALL createOrganization(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [...Object.values(organization)],
    );
    return { ...organization, type: 'Organizations', roles: [], socials: [], password: null };
};
