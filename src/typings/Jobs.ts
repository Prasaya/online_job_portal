import { PartialExcept } from '@typings/utils';

interface skill {
    [key: string]: 'Beginner' | 'Intermediate' | 'Advanced';
}

export default interface DBJob {
    jobId: string;
    companyId: string;
    title: string;
    description: string | null;
    vacancies: number;
    experience: number | null;
    address: string | null;
    district: string | null;
}

export interface Job extends DBJob {
    qualifications: string[];
    skills: {
        skillName: string;
        proficiency: string;
    }[];
}

export interface JobSkill {
    skillName: string,
    proficiency: string,
}

export interface JobQualification {
    level: string,
    discipline: string,
    degree: string
}

export type JobInput = Omit<Job, 'jobId'>;
