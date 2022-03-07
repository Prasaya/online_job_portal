import { v4 as uuidv4 } from 'uuid';
import connection from '@utils/dbSetup';
import { FieldPacket, RowDataPacket } from 'mysql2';
import logger from '@utils/logger';

export const getApplicantVerificationDetailByToken = async (token: string) => {
  try {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'SELECT * FROM applicant_verification ' + 'WHERE token = ?',
      [token],
    );

    if (result.length === 0)
      return null;

    return result[0];

  } catch (error) {
    logger.error('Error getting applicant verification details by token : ', error);
  };
}

export const getApplicantVerificationDetailById = async (applicantId: string) => {
  try {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'SELECT * FROM applicant_verification ' + 'WHERE applicantId = ?',
      [applicantId],
    );

    if (result.length === 0)
      return null;

    return result[0];

  } catch (error) {
    logger.error('Error getting applicant verification details by Id : ', error);
  };
}

export const insertTokenInApplicantVerification = async (
  token: string,
  userId: string,
) => {
  try {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'UPDATE applicant_verification ' +
      'SET token= ? ' +
      'WHERE applicantId = ?',
      [token, userId],
    );

    return { status: 200, message: "Token inserted in Applicant table", success: true };

  } catch (error) {
    logger.error('Error inserting token in Applicant Verification', error);
    return { status: 400, message: error, success: false };

  }
};

export const verifyApplicantEmail = async (token: string) => {
  try {
    let verificationDetails = await getApplicantVerificationDetailByToken(token);

    if (!verificationDetails)
      return { status: 400, message: "Invalid token", success: false };

    // TODO: change status code
    if (verificationDetails.verified)
      return { status: 400, message: "Applicant with token already verified", success: false };

    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'UPDATE applicant_verification SET verified = 1 ' + 'WHERE token = ?',
      [token],
    );

    return { status: 200, message: "Successfully verified email", success: true };

  } catch (error) {
    logger.error('Error verifying Applicant email function : ', error);
    return { status: 400, message: error, success: false };
  }
};


export const isApplicantVerified = async (applicantId: string) => {
  try {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'SELECT * FROM applicant_verification ' + 'WHERE applicantId = ?',
      [applicantId],
    );

    if (result.length == 0) {
      return { status: 400, message: "Applicant not in verification table", success: false };
    }
    console.log(result);

    return { status: 200, message: result[0].verified, success: true };

  } catch (error) {
    logger.error('Error getting verification status of user by id', error);
    return { status: 400, message: error, success: false };

  }
};

export const insertVerificationRegister = async (userId: string) => {
  try {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'INSERT INTO applicant_verification(applicantId, verified) ' +
      'VALUES(?, 0)',
      [userId],
    );
  }
  catch (error) {
    logger.error('Error inserting user in verification table : ', error);
    return { status: 400, message: error, success: false };
  }
};