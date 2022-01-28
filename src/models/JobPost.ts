import { v4 as uuidv4 } from 'uuid';
import User, { NewUserInput, DBUser } from '@typings/User';
import JobPost, { NewJobPost, DBJobPost } from '@typings/JobPost';
import connection from '@utils/dbSetup';
import { RowDataPacket } from 'mysql2';

export const createNewJobPost = async (jobPostData: NewJobPost) : Promise<JobPost> => {
    console.log("Reached inside createNewJobPost");
    const jobData: DBJobPost = {
        jid : uuidv4(),
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

export const getUserByUid = async (uid: string): Promise<Array<User>> => {
    const [result] = await connection.query(
        'SELECT * FROM users INNER JOIN emails on emails.uid = users.uid ' +
        'WHERE users.uid = ?',
        [uid]
    );
    return result as Array<User>;
};

