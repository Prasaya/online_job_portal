DELIMITER |
DROP PROCEDURE IF EXISTS getAuthDetails |
CREATE PROCEDURE getAuthDetails(
    IN inputEmail VARCHAR(255)
)
BEGIN
	SELECT a.id, email, password, type,
		(SELECT
		JSON_ARRAYAGG(json_object('provider', providerName, 'identifier', identifier))
        FROM federated_credentials AS fc
        INNER JOIN federated_credentials_provider AS fcp ON fc.providerId = fcp.providerId
        WHERE fc.id = a.id
        GROUP BY fc.id
        )AS socials
	FROM auth AS a
	WHERE email = inputEmail
	GROUP BY a.id;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS checkExistingUser |
CREATE PROCEDURE checkExistingUser(
    IN inputEmail VARCHAR(250)
)
BEGIN
    SELECT EXISTS(SELECT email FROM auth WHERE email = inputEmail) AS userExists;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS getUserData |
CREATE PROCEDURE getUserData(
    IN uid CHAR(36)
)
BEGIN
	SELECT
    	a.id, a.email, NULL AS password, a.type, ad.firstName, ad.middleName, ad.lastName, ad.picture, ad.birthday, ad.phone,
		ad.gender,
     	ur_o.roles,
		socials.socials,
		as_o.skills,
		aa_o.academics
	FROM auth AS a
	INNER JOIN applicant_data AS ad ON ad.id = a.id
	LEFT JOIN (
		SELECT id, JSON_ARRAYAGG(JSON_OBJECT('provider', fcp.providerName, 'identifier', fc.identifier)) AS socials
		FROM federated_credentials AS fc
		INNER JOIN federated_credentials_provider AS fcp ON fcp.providerId = fc.providerId
		WHERE id = uid
		GROUP BY id
	) AS socials ON socials.id = a.id
	LEFT JOIN (
		SELECT ur.id, JSON_ARRAYAGG(JSON_OBJECT('roleName', r.name, 'level', r.level)) AS roles
		FROM user_roles as ur
		INNER JOIN roles AS r ON r.id = ur.roleId
		WHERE ur.id = uid
		GROUP BY ur.id
	) AS ur_o ON ur_o.id = a.id
	LEFT JOIN (
		SELECT id, JSON_ARRAYAGG(JSON_OBJECT('name', name, 'proficiency', proficiency, 'experience',experience)) AS skills
		FROM applicant_skills AS ask
		WHERE ask.id = uid
		GROUP BY id
	) AS as_o ON as_o.id = a.id
	LEFT join (
		SELECT id, JSON_ARRAYAGG(JSON_OBJECT('qid', aa.qid, 'level', level, 'discipline', discipline, 'degree', degree)) AS academics
		FROM applicant_academics AS aa
		INNER JOIN academic_qualifications AS aq on aq.qid = aa.qid
		WHERE id = uid
		GROUP BY id
	) AS aa_o ON aa_o.id = a.id
	WHERE a.id = uid;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS getOrganizationData |
CREATE PROCEDURE getOrganizationData(
    IN oid CHAR(36)
)
BEGIN
	SELECT a.id AS id, email, NULL AS password, type, JSON_ARRAYAGG(r.name) as roles, od.name, description, address,
        city, website, phone, logo,
        JSON_ARRAYAGG(json_object('provider', providerName, 'identifier', identifier)) AS socials
    FROM auth AS a
    INNER JOIN organization_data AS od ON od.id = a.id
    LEFT JOIN user_roles AS ur ON ur.id = a.id
    LEFT JOIN roles AS r ON r.id = ur.id
    LEFT JOIN federated_credentials AS fc ON fc.id = a.id
    LEFT JOIN federated_credentials_provider AS fcp ON fcp.providerID = fc.providerID
    WHERE a.id = oid
    GROUP BY a.id;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS getQualifications |
CREATE PROCEDURE getQualifications()
BEGIN
	SELECT level, json_objectagg(discipline, disc_deg) AS data FROM
	(
		SELECT
			level,
			discipline,
            json_arrayagg(json_object('id', qid, 'name', degree)) AS disc_deg
		FROM academic_qualifications GROUP BY level, discipline
	) AS disc
	GROUP BY level;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS addApplicantSkills |
CREATE PROCEDURE addApplicantSkills(
	IN uid char(36),
	IN skills JSON,
	IN useReplace BOOLEAN
)
BEGIN
	IF (useReplace = true) THEN
		REPLACE INTO applicant_skills (
		SELECT uid AS id, name, proficiency, experience
        FROM JSON_TABLE(
			skills,
            '$[*]' COLUMNS (
				-- id char(36) PATH "$.id",
                name varchar(100) PATH "$.name",
                proficiency ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') PATH "$.proficiency",
                experience int PATH "$.experience"
			)
		) AS extracted);
	ELSE
		INSERT INTO applicant_skills (
			SELECT uid AS id, name, proficiency, experience
			FROM JSON_TABLE(
				skills,
				'$[*]' COLUMNS (
					-- id char(36) PATH "$.id",
					name varchar(100) PATH "$.name",
					proficiency ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') PATH "$.proficiency",
					experience int PATH "$.experience"
				)
			) AS extracted);
	END IF;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS addApplicantAcademics |
CREATE PROCEDURE addApplicantAcademics(
	IN uid char(36),
	IN academics JSON
)
BEGIN
	INSERT INTO applicant_academics (
		SELECT uid AS id, qid
        FROM JSON_TABLE(
			academics,
            '$[*]' COLUMNS (
				qid int PATH "$"
			)
		) AS extracted);
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS getCompanyJobsData |
CREATE PROCEDURE getCompanyJobsData(
    IN oid CHAR(36)
)
BEGIN
	SELECT j.jobId AS jobId, j.companyId as companyId, od.name as companyName, j.title, j.description,
		j.vacancies, j.experience, j.address, j.district, j.deadline,
		JSON_ARRAYAGG(json_object('skillName', s.skillName, 'proficiency', s.proficiency)) AS skills,
        qualifications.data as qualifications,
        applicants.data as applicants
    FROM jobs AS j
    LEFT JOIN skills AS s ON s.jobId = j.jobId
    INNER JOIN organization_data as od ON j.companyId = od.id
    LEFT JOIN (SELECT
		jb.jobId, JSON_ARRAYAGG(
			JSON_OBJECT('qid', q.qid, 'level', aq.level, 'discipline', aq.discipline, 'degree', aq.degree)
		) as data
		FROM job_qualifications AS q
		INNER JOIN jobs AS jb on jb.jobId = q.jobId
		INNER JOIN academic_qualifications AS aq ON q.qid = aq.qid
		WHERE jb.companyId = oid
		GROUP BY q.jobId
	) as qualifications ON qualifications.jobId = j.jobId
    LEFT JOIN (
		SELECT jb.jobId, JSON_ARRAYAGG(JSON_OBJECT('id', a.id, 'email', a.email)) AS data
		FROM jobs as jb
		INNER JOIN applicant_jobs as aj ON aj.jobId = jb.jobId
		INNER JOIN applicant_data as ad ON ad.id = aj.applicantId
		INNER JOIN auth as a ON a.id = aj.applicantId
        WHERE jb.companyId = oid
        GROUP BY jb.jobId
	) AS applicants on applicants.jobId = j.jobId
    WHERE j.companyId = oid
    GROUP BY j.jobId;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS getJobFromId |
CREATE PROCEDURE getJobFromId(
    IN jId CHAR(36)
)
BEGIN
	SELECT j.jobId, j.companyId, organization_data.name as companyName, j.title,
		j.description, j.vacancies, j.experience, j.address, j.district, j.deadline,
		(SELECT
			JSON_ARRAYAGG(
				JSON_OBJECT('name', s.skillName, 'proficiency', s.proficiency)
			)
            FROM skills AS s
            WHERE s.jobId = jId
            GROUP BY s.jobId
		) AS skills,
        (SELECT
			JSON_ARRAYAGG(
				JSON_OBJECT('qid', q.qid, 'level', aq.level, 'discipline', aq.discipline, 'degree', aq.degree)
			)
			FROM job_qualifications AS q
			INNER JOIN jobs AS jb on jb.jobId = q.jobId
			INNER JOIN academic_qualifications AS aq ON q.qid = aq.qid
            WHERE q.jobId = j.jobId
			GROUP BY q.jobId
        ) as qualifications
	FROM jobs as j
    INNER JOIN organization_data on organization_data.id = j.companyId
    WHERE j.jobId = jId
    GROUP BY j.jobId;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS getJobApplicants |
CREATE PROCEDURE getJobApplicants(
	IN jId CHAR(36)
)
BEGIN
	SELECT JSON_ARRAYAGG(JSON_OBJECT('id', a.id, 'email', a.email)) AS applicants
	FROM jobs as j
	INNER JOIN applicant_jobs as aj ON aj.jobId = j.jobId
    INNER JOIN applicant_data as ad ON ad.id = aj.applicantId
	INNER JOIN auth as a ON a.id = aj.applicantId
	WHERE j.jobId = jId;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS applyForJob |
CREATE PROCEDURE applyForJob (
	applicantId char(36),
    jobId char(36)
)
BEGIN
	INSERT INTO applicant_jobs (applicantId, jobId) VALUES (applicantId, jobId);
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS getApplicantJobs |
CREATE PROCEDURE getApplicantJobs (
	applicantId char(36)
)
BEGIN
	SELECT JSON_ARRAYAGG(JSON_OBJECT('jobId', aj.jobId, 'companyId', companyId, 'companyName', od.name,
		'title', title, 'vacancies', vacancies, 'deadline', deadline
	)) AS jobs
    FROM applicant_jobs AS aj
    INNER JOIN jobs AS j ON j.jobId = aj.jobId
    INNER JOIN organization_data AS od ON od.id = j.companyId
    WHERE aj.applicantId = applicantId
    GROUP BY aj.applicantId;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS updateApplicant |
CREATE PROCEDURE updateApplicant(
    IN uid CHAR(36),
    IN ufirstName VARCHAR(50),
    IN umiddleName VARCHAR(50),
    IN ulastName VARCHAR(50),
    IN ubirthday DATE,
    IN uphone VARCHAR(20),
    IN ugender VARCHAR(10)
)
BEGIN
    DECLARE userType ENUM('Users', 'Organizations');
    SELECT type into userType FROM auth WHERE auth.id = uid;
    IF (ISNULL(userType) OR userType <> 'Users') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid value for user id!';
    END IF;
    SELECT
		IFNULL(ufirstName, ad.firstName),IFNULL(umiddleName, ad.middleName),IFNULL(ulastName, ad.lastName),
        IFNULL(ubirthday, ad.birthday),IFNULL(uphone, ad.phone),
        IFNULL(ugender, ad.gender)
    FROM auth
    INNER JOIN applicant_data AS ad ON ad.id = auth.id
    WHERE auth.id = uid
    INTO ufirstName, umiddleName, ulastName, ubirthday,uphone, ugender;

    UPDATE applicant_data
    SET firstName = ufirstName, middleName = umiddleName, lastName = ulastName, birthday = ubirthday, phone = uphone, gender = ugender
    WHERE applicant_data.id = uid;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS deleteExpiredJobs |
CREATE PROCEDURE deleteExpiredJobs()
BEGIN
	SET SQL_SAFE_UPDATES = 0;
	DELETE FROM jobs WHERE jobs.deadline < current_date();
	SET SQL_SAFE_UPDATES = 1;
END |
DELIMITER ;


DELIMITER |
DROP PROCEDURE IF EXISTS applicantsForJob |
CREATE PROCEDURE applicantsForJob(
	IN jId CHAR(36)
)
BEGIN
	SELECT aj.applicantId, ad.firstName, ad.middleName, ad.lastName, ad.picture, au.email
    FROM applicant_jobs as aj
    INNER JOIN applicant_data as ad on ad.id = aj.applicantId
    INNER JOIN auth as au on au.id = ad.id
    WHERE aj.jobId = jId;
END |
DELIMITER ;


