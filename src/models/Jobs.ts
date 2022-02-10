import { v4 as uuidv4 } from 'uuid';
import User, { NewUserInput, DBUser } from '@typings/User';
import JobPost, { NewJobPost, DBJobPost } from '@typings/JobPost';
import DBJob, { Job, JobInput, JobSkill, JobQualification } from '@typings/Jobs'
import connection from '@utils/dbSetup';
import { RowDataPacket } from 'mysql2';
import { QualifiedName } from 'typescript';

export const createNewJobPost = async (jobPostData: JobInput): Promise<DBJob> => {
    console.log("Reached inside createNewJobPost");
    console.log(jobPostData);
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
    // console.log(Array.isArray(qualifications));
    console.log(...Object.values(jobData));
    await connection.execute(
        'INSERT INTO jobs ' +
        '(jobId, companyId, title, description, vacancies, experience, address, district) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [...Object.values(jobData)]
    );

    for (let i = 0; i < qualifications.length; ++i) {
        const qId = uuidv4();
        console.log("Inside qualifications : ", typeof (qualifications[i]), qualifications[i], qualifications);
        console.log(typeof (qualifications), qualifications.length);
        await connection.execute(
            'INSERT INTO academicQualifications ' +
            '(qId, level, discipline, degree) ' +
            'VALUES (?, ?, ?, ?)',
            [qId, ...Object.values(qualifications[i])]
        );
    }
    console.log(skills);
    for (let x in skills) {
        console.log("Inside skills : ", x, skills);
        await connection.execute(
            'INSERT INTO skills ' +
            '(jobId, skillName, proficiency) ' +
            'VALUES (?, ?, ?)',
            [jobData.jobId, ...Object.values(x)]
        )
    }

    return { ...<DBJob>jobData };
}


