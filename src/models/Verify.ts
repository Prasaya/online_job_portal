import { v4 as uuidv4 } from 'uuid';
import connection from '@utils/dbSetup';
import { FieldPacket, RowDataPacket } from 'mysql2';
import logger from '@utils/logger';

export const sendApplicantVerificationDetails = async (token: string) => {
    try {
        const [result]: [RowDataPacket[], FieldPacket[]] =
            await connection.execute(
                'SELECT * FROM applicant_verification ' +
                'WHERE token = ?',
                [token]
            );
        return result[0];
    } catch (error) {
        logger.error('Error deleting jobs', error);
    }
};

export const verifyApplicantEmail = async (token: string) => {
    try {
        const [result]: [RowDataPacket[], FieldPacket[]] =
            await connection.execute(
                'UPDATE applicant_verification SET verified = 1 ' +
                'WHERE token = ?',
                [token]
            );
    } catch (error) {
        logger.error('Error deleting jobs', error);
    }
}

export const insertTokenInApplicantVerification = async (token: string, userId: string) => {
    try {
        const [result]: [RowDataPacket[], FieldPacket[]] =
            await connection.execute(
                'UPDATE applicant_verification ' +
                'SET token= ? ' +
                'WHERE applicantId = ?',
                [token, userId]
            );
    } catch (error) {
        logger.error('Error deleting jobs', error);
    }

