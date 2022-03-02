drop table if exists applicant_verification;
drop table if exists applicant_jobs;
drop table if exists job_qualifications;
drop table if exists skills;
drop table if exists jobs;
drop table if exists federated_credentials;
drop table if exists federated_credentials_provider;
drop table if exists applicant_data;
drop table if exists organization_data;
drop table if exists user_academics;
drop table if exists user_skills;
drop table if exists user_roles;
drop table if exists auth;
drop table if exists roles;
truncate sessions;

CREATE TABLE IF NOT EXISTS academic_qualifications (
	qid int auto_increment unique not null,
	level varchar(30) not null,
    discipline varchar(100) not null,
    degree varchar(100) not null,
    primary key (qid)
);

CREATE TABLE roles (
    id int unique not null,
    name varchar(20) unique not null,
    level int not null,
    primary key (id)
);
INSERT INTO roles (id, name, level) VALUES
	(1, "Administrators", 5),
    (2, "Organizations", 10),
    (3, "Applicants", 10);

CREATE TABLE auth (
    id char(36) unique not null,
    email varchar(255) unique not null,
    password char(60),
    type ENUM('Users', 'Organizations') not null,
    primary key (email)
);

-- Many to many relationship with auth
CREATE TABLE user_roles (
    id char(36) not null,
    roleId int not null,
    primary key(id, roleId),
    foreign key (id) references auth(id) ON UPDATE CASCADE ON DELETE CASCADE,
    foreign key (roleId) references roles(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- One to one relationship with auth
CREATE TABLE organization_data (
    id char(36) unique not null,
    name varchar(100) not null,
    description varchar(5000),
    address varchar(200),
    city varchar(100),
    website varchar(200),
    phone varchar(20),
    logo varchar(200),
    primary key (id),
    foreign key (id) references auth(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- One to one relationship with auth
CREATE TABLE applicant_data (
    id char(36) unique not null,
    firstName varchar(50),
    middleName varchar(50),
    lastName varchar(50),
    picture varchar(200),
    birthday date,
    phone varchar(20),
    gender varchar(10),
    primary key (id),
    foreign key (id) references auth(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- One to many relationship (applicant_data to applicant_academics)
CREATE TABLE applicant_academics (
	id char(36) not null,
    qid int not null,
    primary key(id, qid),
    foreign key (id) references applicant_data(id) ON UPDATE CASCADE ON DELETE CASCADE,
    foreign key (qid) references academic_qualifications(qid) ON UPDATE CASCADE ON DELETE CASCADE
);

-- One to many relationship (applicant_data to applicant_skills)
CREATE TABLE applicant_skills (
	id char(36) not null,
    name varchar(100) not null,
    proficiency ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') not null,
    experience int not null,
    primary key(id, name),
    foreign key (id) references applicant_data(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE federated_credentials_provider (
    providerId int auto_increment,
    providerName varchar(50) unique not null,
    primary key(providerId)
);

-- One to many relationship (auth to federated_credentials)
CREATE TABLE federated_credentials (
    id char(36) not null,
    providerId int not null,
    identifier varchar(2048) not null,
    primary key (id, providerId),
    foreign key (id) references auth(id) ON UPDATE CASCADE ON DELETE CASCADE,
    foreign key (providerId) references federated_credentials_provider(providerId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE jobs (
    jobId char(36),
    companyId char(36) not null,
    title varchar(100) not null,
    description varchar(5000),
    vacancies int not null,
    experience int,
    address varchar(1000),
    district varchar(1000),
    deadline date,
    primary key (jobId),
    foreign key (companyId) references organization_data(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE skills (
    skillName varchar(100) not null,
    jobId char(36) not null,
    proficiency ENUM('Beginner', 'Intermediate', 'Advanced') not null,
    primary key (skillName, jobId),
    foreign key (jobId) references jobs(jobId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE job_qualifications (
    jobId char(36) not null,
    qId int not null,
    primary key (jobId, qId),
    foreign key (jobId) references jobs(jobId) ON UPDATE CASCADE ON DELETE CASCADE,
    foreign key (qId) references academic_qualifications(qId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE applicant_jobs (
    applicantId char(36) not null,
    jobId char(36) not null,
    primary key (applicantId, jobId),
    foreign key (applicantId) references applicant_data(id) ON UPDATE CASCADE ON DELETE CASCADE,
    foreign key (jobId) references jobs(jobId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE applicant_verification (
    applicantId varchar(36) not null,
    token char(100),
    verified BOOLEAN DEFAULT false,
    primary key (applicantId),
    foreign key (applicantId) references applicant_data(id) ON DELETE CASCADE
);


