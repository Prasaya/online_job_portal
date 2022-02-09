drop table if exists webapp.companies;
drop table if exists webapp.federated_credentials;
drop table if exists webapp.federated_credentials_provider;
drop table if exists webapp.emails;
drop table if exists webapp.users;
drop table if exists webapp.roles;
drop view if exists vwAuth;
drop view if exists vwUser;
drop view if exists vwCompany;
drop view if exists vwAuthCompany;
truncate webapp.sessions;

CREATE TABLE webapp.roles (
    roleId int auto_increment,
    roleName varchar(20) unique not null,
    primary key (roleid)
);
Insert into roles (roleId, roleName) values (1, "Administrators"), (2, "Employers"),
    (3, "Applicants"), (4, "Users");

CREATE TABLE webapp.companies (
    cid char(36),
    email varchar(250) unique not null,
    password char(60),
    name varchar(100) not null,
    description varchar(5000),
    address varchar(200),
    city varchar(100),
    website varchar(200),
    phone varchar(20),
    logo varchar(100),
    primary key (cid)
);

CREATE TABLE webapp.users (
    uid char(36),
    email varchar(250) unique not null,
    password char(60),
    firstName varchar(50),
    middleName varchar(50),
    lastName varchar(50),
    picture varchar(200),
    birthday datetime,
    phone varchar(20),
    gender varchar(10),
    primary key (uid)
);

CREATE TABLE webapp.federated_credentials_provider (
    providerId int auto_increment,
    providerName varchar(50) unique not null,
    primary key(providerId)
);

CREATE TABLE webapp.federated_credentials (
    uid char(36) not null,
    providerId int not null,
    identifier varchar(100) not null,
    primary key (providerId, identifier),
    foreign key (uid) references users(uid),
    foreign key (providerId) references federated_credentials_provider(providerId)
);

CREATE OR REPLACE VIEW vwUser AS
	SELECT u.uid, email, firstName, middleName, lastName, picture, birthday, phone, gender,
        providerName, identifier, 'User' AS type
    FROM users AS u
    LEFT JOIN federated_credentials AS fc ON fc.uid = u.uid
    LEFT JOIN federated_credentials_provider AS fcp ON fcp.providerID = fc.providerID;

CREATE OR REPLACE VIEW vwCompany AS
    SELECT cid, name, description, address, city, email, website, phone, logo, 'Company' as type
    FROM companies;
