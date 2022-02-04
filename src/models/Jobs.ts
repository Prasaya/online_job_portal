import { v4 as uuidv4 } from 'uuid';
import User, { NewUserInput, DBUser } from '@typings/User';
import JobPost, { NewJobPost, DBJobPost } from '@typings/JobPost';
import DBJob, { Job, JobInput } from '@typings/Jobs'
import connection from '@utils/dbSetup';
import { RowDataPacket } from 'mysql2';

export const createNewJobPost = async (jobPostData: NewJobPost): Promise<JobPost> => {
    console.log("Reached inside createNewJobPost");
    const jobData: DBJobPost = {
        jid: uuidv4(),
        title: jobPostData.title,
        jobDescription: jobPostData.jobDescription || null,
        experience: jobPostData.experience || null,
        education: jobPostData.education || null,
        skills: jobPostData.skills || null,
    }
    console.log(...Object.values(jobData));
    await connection.execute(
        'INSERT INTO jobPost ' +
        '(jid, title, jobDescription, experience, education, skills) ' +
        'VALUES (?, ?, ?, ?, ?, ?)',
        [...Object.values(jobData)]
    );
    return { ...<JobPost>jobData };
}


