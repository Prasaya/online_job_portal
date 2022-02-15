import { PartialExcept } from '@typings/utils';

export default interface JobPost {
    jid: string;
    title: string;
    jobDescription: string | null;
    experience: string | null;
    education: string | null;
    skills: string | null;
}

export type NewJobPost = PartialExcept<Omit<JobPost, 'jid'>, 'title'>;
export type DBJobPost = PartialExcept<JobPost, 'jid'>;
