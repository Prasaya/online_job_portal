DELIMITER |
DROP PROCEDURE IF EXISTS getAuthDetails |
CREATE PROCEDURE getAuthDetails(
    IN inputEmail VARCHAR(255)
)
BEGIN
	SELECT a.id, email, password, type,
		JSON_ARRAYAGG(json_object('provider', providerName, 'identifier', identifier)) AS socials
	FROM auth AS a
    LEFT JOIN federated_credentials AS fc ON fc.id = a.id
	LEFT JOIN federated_credentials_provider AS fcp on fcp.providerId = fc.providerID
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
	SELECT basics.*,
		(SELECT
			JSON_ARRAYAGG(
				JSON_OBJECT('name', us.name, 'proficiency', proficiency, 'experience', experience)
			)
            FROM applicant_skills AS us
            GROUP BY us.id
            HAVING us.id = uid
		) AS skills,
        (SELECT
			JSON_ARRAYAGG(
				JSON_OBJECT('qid', aq.qid, 'level', level, 'discipline', discipline, 'degree', degree)
			)
            FROM applicant_academics AS ua
            INNER JOIN academic_qualifications AS aq ON aq.qid = ua.qid
            GROUP BY ua.id
            HAVING ua.id = uid
 		) AS academics
	FROM
	(
		SELECT a.id AS id, email, NULL AS password, type, firstName, middleName, lastName,
			picture, birthday, phone, gender,
            (SELECT JSON_ARRAYAGG(r.name)
				FROM user_roles AS ur
                INNER JOIN roles AS r ON r.id = ur.roleId
                GROUP BY ur.id
                HAVING ur.id = uid
			) AS roles,
            (SELECT JSON_ARRAYAGG(json_object('provider', providerName, 'identifier', identifier))
				FROM federated_credentials AS fc
                INNER JOIN federated_credentials_provider AS fcp ON fcp.providerId = fc.providerId
                GROUP BY id
                HAVING id = uid
			) AS socials
		FROM auth AS a
        INNER JOIN applicant_data AS ad ON ad.id = a.id
        WHERE a.id = uid
	) AS basics
    GROUP BY basics.id
    HAVING basics.id = uid;
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
	IN skills JSON
)
BEGIN
	INSERT INTO applicant_skills (
		SELECT uid AS id, name, proficiency, experience
        FROM JSON_TABLE(
			skills,
            '$[*]' COLUMNS (
				-- id char(36) PATH "$.id",
                name varchar(100) PATH "$.name",
                proficiency ENUM('Beginner', 'Intermediate', 'Advanced') PATH "$.proficiency",
                experience int PATH "$.experience"
			)
		) AS extracted);
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

