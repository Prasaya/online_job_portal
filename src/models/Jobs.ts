import { v4 as uuidv4 } from 'uuid';
import { Schema } from 'express-validator';
import User, { NewUserInput, DBUser } from '@typings/User';
import JobPost, { NewJobPost, DBJobPost } from '@typings/JobPost';
import DBJob, { Job, JobInput, JobSkill, JobQualification } from '@typings/Jobs'
import connection from '@utils/dbSetup';
import { RowDataPacket } from 'mysql2';
import { QualifiedName } from 'typescript';
import { ValidatorsImpl } from 'express-validator/src/chain';

export const JobCreationSchema: Schema = {
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
        isObject: true,
    },
    'qualifications.*.level': {
        isString: true,
        isIn: {
            //TODO : Add more options
            options: [["Bachelors", "Masters"]],
            errorMessage: "Invalid qualifications Level"
        }
    },
    'qualifications.*.discipline': {
        isString: true,
        isIn: {
            //TODO : Add more options
            options: [["Agriculture", "Computer"]],
            errorMessage: "Invalid Qualifications Discipline"
        }
    },
    'qualifications.*.degree': {
        isString: true,
    },
    'skills.*.skillName': {
        isString: true,
        isLength: { options: [{ min: 1, max: 100 }] },
    },
    'skills.*.proficiency': {
        isString: true,
        isIn: {
            options: [["Begineer", "Intermediate", "Advanced"]],
            errorMessage: "Invalid Skills Proficiency"
        }
    }
};



export const createNewJobPost = async (jobPostData: JobInput): Promise<DBJob> => {
    console.log("Reached inside createNewJobPost");

    let PromiseArray = [];

    const jobData: DBJob = {
        jobId: uuidv4(),
        //TODO: insert comapny Id
        companyId: '1',
        title: jobPostData.title,
        description: jobPostData.description || null,
        vacancies: jobPostData.vacancies,
        experience: jobPostData.experience || null,
        address: jobPostData.address || null,
        district: jobPostData.district || null,
    };

    //TODO: generate qualification and skills id for each skill
    //TODO: link job id and qualification and skills
    const qualifications: JobQualification[] = jobPostData.qualifications;
    const skills: JobSkill[] = jobPostData.skills;

    console.log(...Object.values(jobData));
    let promise1 = connection.execute(
        'INSERT INTO jobs ' +
        '(jobId, companyId, title, description, vacancies, experience, address, district) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [...Object.values(jobData)]
    );
    PromiseArray.push(promise1);

    // for (let i = 0; i < qualifications.length; ++i) {
    //     const qId = uuidv4();
    //     console.log("Inside qualifications : ", typeof (qualifications[i]), qualifications[i], qualifications);
    //     console.log(typeof (qualifications), qualifications.length);
    //     await connection.execute(
    //         'INSERT INTO academicQualifications ' +
    //         '(qId, level, discipline, degree) ' +
    //         'VALUES (?, ?, ?, ?)',
    //         [qId, ...Object.values(qualifications[i])]
    //     );
    // }

    let tempPromise;
    // for (let i = 0; i < skills.length; ++i) {
    //     console.log("Inside skills : ", skills[i]);
    //     tempPromise = connection.execute(
    //         'INSERT INTO skills ' +
    //         '(jobId, skillName, proficiency) ' +
    //         'VALUES (?, ?, ?)',
    //         [jobData.jobId, ...Object.values(skills[i])]
    //     )
    //     PromiseArray.push(tempPromise);
    // }

    skills.forEach(
        (skill) => {
            tempPromise = connection.execute(
                'INSERT INTO skills ' +
                '(jobId, skillName, proficiency) ' +
                'VALUES (?, ?, ?)',
                [jobData.jobId, ...Object.values(skill)]
            )
            PromiseArray.push(tempPromise);
        }
    )

    await Promise.all(PromiseArray).then((values) => {
        console.log(values);
    })
        .catch((error) => {
            console.log("Error in Promises", error);
        });

    return { ...<DBJob>jobData };
}


export const deleteJobPost = async (jobId: string) => {
    console.log("Reached inside deleteJobPost");

    let promise1 = connection.execute(
        'DELETE FROM jobs ' +
        'WHERE jobId = ?',
        [jobId]
    );

    let promise2 = connection.execute(
        'DELETE FROM skills ' +
        'WHERE jobId = ?',
        [jobId]
    );

    let promise3 = connection.execute(
        'DELETE FROM jobQualifications ' +
        'WHERE jobId = ?',
        [jobId]
    );

    await Promise.all([promise1, promise2, promise3]).then((values) => {
        console.log(values);
    })
        .catch((error) => {
            console.log("Error in Job delete Promises", error);
        });
}