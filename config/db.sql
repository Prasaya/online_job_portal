drop table if exists organizations;
drop table if exists federated_credentials;
drop table if exists federated_credentials_provider;
drop table if exists users;
drop table if exists roles;
drop table if exists jobs;
drop table if exists skills;
drop table if exists job_qualifications;
drop table if exists academic_qualifications;
truncate sessions;

CREATE TABLE roles (
    roleId int,
    roleName varchar(20) unique not null,
    roleLevel int,
    primary key (roleid)
);
INSERT INTO roles (roleId, roleName, roleLevel) VALUES 
	(1, "Administrators", 5), 
    (2, "Organizations", 10),
    (3, "Users", 10);

CREATE TABLE organizations (
    oid char(36),
    role int not null default 2,
    email varchar(255) unique not null,
    password char(60) not null,
    name varchar(100) not null,
    description varchar(5000),
    address varchar(200),
    city varchar(100),
    website varchar(200),
    phone varchar(20),
    logo varchar(200),
    primary key (oid),
    foreign key (role) references roles(roleId)
);

CREATE TABLE users (
    uid char(36),
    role int not null default 3,
    email varchar(255) unique not null,
    password char(60),
    firstName varchar(50),
    middleName varchar(50),
    lastName varchar(50),
    picture varchar(200),
    birthday date,
    phone varchar(20),
    gender varchar(10),
    primary key (uid),
    foreign key (role) references roles(roleId)
);

CREATE TABLE federated_credentials_provider (
    providerId int auto_increment,
    providerName varchar(50) unique not null,
    primary key(providerId)
);

CREATE TABLE federated_credentials (
    uid char(36) not null,
    providerId int not null,
    identifier varchar(2048) not null,
    primary key (uid, providerId),
    foreign key (uid) references users(uid),
    foreign key (providerId) references federated_credentials_provider(providerId)
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
    primary key (jobId),
    foreign key (companyId) references organizations(oId);
);

CREATE TABLE skills (
    skillName varchar(100) not null,
    jobId char(36) not null,
    proficiency ENUM('Beginner', 'Intermediate', 'Advanced') not null,
    primary key (skillName, jobId),
    foreign key (jobId) references jobs(jobId)
);

CREATE TABLE academic_qualifications (
	qid int auto_increment,
	level varchar(30),
    discipline varchar(100),
    degree varchar(100),
    primary key (qid)
);

CREATE TABLE job_qualifications (
    jobId char(36) not null,
    qId varchar(36) not null,
    primary key (jobId, qId),
    foreign key (jobId) references jobs(jobId),
    foreign key (qId) references academic_qualifications(qId)
);

