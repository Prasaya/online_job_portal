import logger from "@utils/logger";
import connection from '@utils/dbSetup';
import { FieldPacket, RowDataPacket } from 'mysql2';

export const insertNewJobStatistics = async (jobId: string) => {
    try {
        await connection.execute(
            'INSERT INTO job_statistics(jobId) ' +
            'VALUES(?) ',
            [jobId]
        );
        return { message: 'Job statistics inserted successfully', success: true };

    } catch (error) {
        logger.error('Error inserting new job to statistics', error);
        return { message: 'Error inserting new job to statistics', success: false };
    }
}

export const insertJobEmailStatistics = async (jobId: string, applicantId: string) => {
    try {
        await connection.execute(

            'REPLACE INTO job_visited_email(jobId, applicantId) ' +
            'VALUES(?, ?) ',
            [jobId, applicantId]
        );
        return { message: 'Job and applicant data for email view added succesfully', success: true };

    } catch (error) {
        logger.error('Error inserting job email statistics', error);
        return { message: 'Error inserting job Email statistics', success: false };
    }
}

export const insertJobSmsStatistics = async (jobId: string, applicantId: string) => {
    try {
        await connection.execute(
            'REPLACE INTO job_visited_sms(jobId, applicantId) ' +
            'VALUES(?, ?) ',
            [jobId, applicantId]
        );
        return { message: 'Job and applicant data for sms view added succesfully', success: true };

    } catch (error) {
        logger.error('Error inserting job email statistics', error);
        return { message: 'Error inserting job Email statistics', success: false };
    }
}

export const getStatistics = async (jobId: string) => {
    try {
        const [result] = await connection.execute(
            'SELECT linkOpen, notificationSent, ' +
            '(SELECT count(*) from job_visited_sms where jobId = ?) as smsVisitors, ' +
            '(SELECT count(*) from job_visited_email where jobId = ?) as emailVisitors ' +
            'FROM job_statistics where jobId = ?',
            [jobId, jobId, jobId]
        )
        if (Array.isArray(result) && result.length > 0) {
            return {
                status: 200,
                success: true,
                data: result[0],
            }
        }
        return {
            status: 200,
            success: true,
            data: [],
        }
    }
    catch (e) {
        return { status: 500, message: 'Something went wrong!', success: false }
    }
}


export const updateNotificationsSent = async (jobId: string, notificationSent: number) => {
    try {
        await connection.execute(
            'UPDATE job_statistics ' +
            'SET notificationSent = notificationSent + ? ' +
            'WHERE jobId = ? ',
            [notificationSent, jobId]
        );
        return { message: 'Updated notification successfully', success: true };

    } catch (error) {
        logger.error('Error updating notification', error);
        return { message: 'Error updating notification', success: false };
    }
}

export const incrementLinkOpen = async (jobId: string) => {
    try {
        await connection.execute(
            'UPDATE job_statistics ' +
            'SET linkOpen = linkOpen + 1 ' +
            'WHERE jobId = ?',
            [jobId]
        );
        return { message: 'Increment link successfully', success: true };

    } catch (error) {
        logger.error('Error incrementing link notification', error);
        return { message: 'Error incrementing link', success: false };
    }
}


