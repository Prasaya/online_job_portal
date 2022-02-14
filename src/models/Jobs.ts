import { v4 as uuidv4 } from 'uuid';
import { Schema } from 'express-validator';
import DBJob, { JobInput, JobSkill, JobQualification } from '@typings/Jobs';
import connection from '@utils/dbSetup';
import { FieldPacket, RowDataPacket } from 'mysql2';
import internal from 'stream';
import logger from '@root/utils/logger';

export const JobCreationSchema: Schema = {
    companyId: {
        in: ['body'],
        isString: true,
        isLength: { options: [{ max: 36 }] },
    },
    title: {
        in: ['body'],
        isString: true,
        isLength: { options: [{ min: 1, max: 100 }] },
    },
    description: {
        in: ['body'],
        optional: true,
        isString: true,
        isLength: { options: [{ max: 1000 }] },
    },
    vacancies: {
        in: ['body'],
        optional: true,
        isNumeric: true,
    },
    address: {
        in: ['body'],
        optional: true,
        isString: true,
        isLength: { options: [{ max: 1000 }] },
    },
    district: {
        in: ['body'],
        optional: true,
        isString: true,
        isLength: { options: [{ max: 1000 }] },
    },
    qualifications: {
        in: ['body'],
        isArray: true,
    },
    'qualifications.*': { isNumeric: true },
    skills: {
        in: ['body'],
        isArray: true,
    },
    'skills.*.skillName': {
        isString: true,
        isLength: { options: [{ min: 1, max: 100 }] },
    },
    'skills.*.proficiency': {
        isString: true,
        isIn: {
            options: [
                [
                    'Beginner',
                    'Intermediate',
                    'Advanced',
                ],
            ],
            errorMessage: 'Invalid Skills Proficiency',
        },
    },
};

export const createNewJobPost = async (jobPostData: JobInput): Promise<DBJob> => {
    // console.log('Reached inside createNewJobPost');

    const PromiseArray: Array<Promise<[RowDataPacket[], FieldPacket[]]>> = [];

    const jobData: DBJob = {
        jobId: uuidv4(),
        companyId: jobPostData.companyId,
        title: jobPostData.title,
        description: jobPostData.description || null,
        vacancies: jobPostData.vacancies,
        experience: jobPostData.experience || null,
        address: jobPostData.address || null,
        district: jobPostData.district || null,
    };

    const { qualifications, skills } = jobPostData;
    const cols = Object.keys(jobData).join(', ');
    await connection.execute(
        'INSERT INTO jobs '
        + '(jobId, companyId, title, description, vacancies, experience, address, district) '
        + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [...Object.values(jobData)],
    );

    const baseQuery = 'INSERT INTO job_qualifications (jobId, qid) VALUES ';
    let parameters: string[] = [];
    let query = baseQuery;
    qualifications.forEach(
        (qualification, index) => {
            // Batch qualifications into groups of 20
            // for 0-19 index/20 gives 0 and for 20-39 index/20 gives 1 and so on
            // at index 20, 1(from division) != 0(from length) so we insert into array
            // This is to avoid the max bytes limitation of mysql
            if (
                Math.floor(index / 20) === PromiseArray.length
                && index !== qualifications.length - 1
            ) {
                query += '(?, ?), ';
                parameters.push(
                    jobData.jobId,
                    qualification,
                );
            } else {
                query += '(?, ?)';
                parameters.push(
                    jobData.jobId,
                    qualification,
                );
                PromiseArray.push(
                    connection.query(
                        query,
                        parameters,
                    ),
                );
                query = baseQuery;
                parameters = [];
            }
        },
    );

    const skillsBaseQuery = 'INSERT INTO skills (jobId, skillName, proficiency) VALUES ';
    parameters = [];
    query = skillsBaseQuery;
    const initialPromiseArrayLength = PromiseArray.length;
    skills.forEach(
        (skill, index) => {
            // Batch qualifications into groups of 20
            // for 0-19 index/20 gives 0 and for 20-39 index/20 gives 1 and so on
            // at index 20, 1(from division) != 0(from length) so we insert into array
            // This is to avoid the max bytes limitation of mysql
            if (
                Math.floor(index / 20) === PromiseArray.length - initialPromiseArrayLength
                && index !== skills.length - 1
            ) {
                query += '(?, ?, ?), ';
                parameters.push(
                    jobData.jobId,
                    skill.skillName,
                    skill.proficiency,
                );
            } else {
                query += '(?, ?, ?)';
                parameters.push(
                    jobData.jobId,
                    skill.skillName,
                    skill.proficiency,
                );
                PromiseArray.push(connection.query(
                    query,
                    parameters,
                ));
                query = skillsBaseQuery;
                parameters = [];
            }
        },
    );
    try {
        await Promise.all(PromiseArray);
    } catch (error) {
        logger.error(error);
    }
    return { ...<DBJob>jobData };
};

export const deleteJobPost = async (jobId: string) => {
    console.log('Reached inside deleteJobPost');

    const promise1 = connection.execute(
        'DELETE FROM jobs '
        + 'WHERE jobId = ?',
        [jobId],
    );

    const promise2 = connection.execute(
        'DELETE FROM skills '
        + 'WHERE jobId = ?',
        [jobId],
    );

    const promise3 = connection.execute(
        'DELETE FROM job_qualifications '
        + 'WHERE jobId = ?',
        [jobId],
    );

    await Promise.all([
        promise1,
        promise2,
        promise3,
    ]).then((values) => {
        console.log(values);
    })
        .catch((error) => {
            console.log(
                'Error in Job delete Promises',
                error,
            );
        });
};
