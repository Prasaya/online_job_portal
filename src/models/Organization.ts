import { v4 as uuidv4 } from 'uuid';
import { Schema } from 'express-validator';
import {
  Organization,
  NewOrganizationInput,
  NewOrganizationParameters,
  UpdateOrganization,
} from '@typings/Organization';
import connection from '@utils/dbSetup';
import hashPassword from '@utils/password';
import { formatDate } from '@utils/date';
import { RowDataPacket } from 'mysql2/promise';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import logger from '@utils/logger';

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
};

const updateOrganizationSchema = { ...organizationRegisterSchema };
delete updateOrganizationSchema.email;
delete updateOrganizationSchema.password;
export { updateOrganizationSchema };

export const createNewOrganization = async (
  organizationData: NewOrganizationInput,
): Promise<Organization> => {
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
  };
  await connection.execute(
    'CALL createOrganization(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [...Object.values(organization)],
  );
  return {
    ...organization,
    type: 'Organizations',
    roles: [],
    socials: [],
    password: null,
  };
};

export const fetchOrganizationJobs = async (companyId: string) => {
  const [result] = await connection.execute('CALL getCompanyJobsData(?)', [
    companyId,
  ]);
  (result as RowDataPacket)[0].forEach((entry) => {
    entry.deadline = formatDate(entry.deadline);
  });
  if (Array.isArray(result)) {
    return { jobList: result[0], success: true };
  }
  return { jobList: [], success: false };
};

export const updateLogo = async (
  organizationId: string,
  picture: UploadedFile,
) => {
  try {
    const fileName = organizationId + path.extname(picture.name);
    await picture.mv(path.resolve('.', 'images', fileName));
    await connection.query(
      'UPDATE organization_data SET logo = ? WHERE id = ?',
      [fileName, organizationId],
    );
    return {
      name: picture.name,
      size: picture.size,
      encoding: picture.encoding,
      mimetype: picture.mimetype,
      truncated: picture.truncated,
      url: fileName,
    };
  } catch (err) {
    logger.error(err);
    return { message: 'Something went wrong!', success: false };
  }
};

export const updateOrganization = async (
  organizationData: UpdateOrganization,
) => {
  const organization = {
    id: organizationData.id,
    name: organizationData.name,
    description: organizationData.description,
    address: organizationData.address,
    city: organizationData.city,
    website: organizationData.website,
    phone: organizationData.phone,
  };
  await connection.execute('CALL updateOrganization(?, ?, ?, ?, ?, ?, ?)', [
    ...Object.values(organization),
  ]);
  return { ...organization };
};
