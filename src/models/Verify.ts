import { v4 as uuidv4 } from 'uuid';
import connection from '@utils/dbSetup';
import { FieldPacket, RowDataPacket } from 'mysql2';
import logger from '@utils/logger';

export const getVerificationDetailByToken = async (token: string) => {
  try {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'SELECT * FROM applicant_verification ' + 'WHERE token = ?',
      [token],
    );

    if (result.length === 0)
      return null;

    return result[0];

  } catch (error) {
    logger.error('Error getting verification details by token : ', error);
  };
}

export const getVerificationDetailById = async (applicantId: string) => {
  try {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'SELECT * FROM applicant_verification ' + 'WHERE id = ?',
      [applicantId],
    );

    if (result.length === 0)
      return null;

    return result[0];

  } catch (error) {
    logger.error('Error getting verification details by Id : ', error);
  };
}

export const insertTokenInVerification = async (
  token: string,
  userId: string,
) => {
  try {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'UPDATE applicant_verification ' +
      'SET token= ? ' +
      'WHERE id = ?',
      [token, userId],
    );

    return { status: 200, message: "Token inserted in Verification table", success: true };

  } catch (error) {
    logger.error('Error inserting token in Verification table', error);
    return { status: 400, message: error, success: false };

  }
};

export const verifyEmail = async (token: string) => {
  try {
    let verificationDetails = await getVerificationDetailByToken(token);

    if (!verificationDetails)
      return { status: 400, message: "Invalid token", success: false };

    // TODO: change status code
    if (verificationDetails.verified)
      return { status: 400, message: "User with token already verified", success: false };

    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'UPDATE applicant_verification SET verified = 1 ' + 'WHERE token = ?',
      [token],
    );

    return { status: 200, message: "Successfully verified email", success: true };

  } catch (error) {
    logger.error('Error verifying email : ', error);
    return { status: 400, message: error, success: false };
  }
};


export const isUserVerified = async (id: string) => {
  try {
    const [result]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
      'SELECT * FROM applicant_verification ' + 'WHERE id = ?',
      [id],
    );

    if (result.length == 0) {
      return { status: 400, message: "User not in verification table", success: false };
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
      'INSERT INTO applicant_verification(id, verified) ' +
      'VALUES(?, 0)',
      [userId],
    );
  }
  catch (error) {
    logger.error('Error inserting user in verification table : ', error);
    return { status: 400, message: error, success: false };
  }
};