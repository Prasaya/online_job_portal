import { v4 as uuidv4 } from 'uuid';
import User, { NewUserInput, DBUser } from '@typings/User';
import JobPost, { NewJobPost, DBJobPost } from '@typings/JobPost';
import DBJob, { Job, JobInput, JobSkill, JobQualification } from '@typings/Jobs'
import connection from '@utils/dbSetup';
import { RowDataPacket } from 'mysql2';
import { QualifiedName } from 'typescript';

export const createNewJobPost = async (jobPostData: JobInput): Promise<DBJob> => {
    console.log("Reached inside createNewJobPost");
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
    await connection.execute(
        'INSERT INTO jobs ' +
        '(jobId, companyId, title, description, vacancies, experience, address, district) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [...Object.values(jobData)]
    );

    for (let x in qualifications) {
        await connection.execute(
            'INSERT INTO academicQualifications ' +
            '(qId, level, discipline, degree) ' +
            'VALUES (?, ?, ?, ?)',
            [...Object.values(x)]
        );
    }

    for (let x in skills) {
        await connection.execute(
            'INSERT INTO skills ' +
            '(skillName, jobId, proficiency) ' +
            'VALUES (?, ?, ?)',
            [...Object.values(x)]
        )
    }

    return { ...<DBJob>jobData };
}


