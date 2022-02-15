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
	SELECT a.id AS id, email, NULL AS password, type, JSON_ARRAYAGG(r.name) as roles, firstName, middleName, lastName,
        picture, birthday, phone, gender,
        JSON_ARRAYAGG(json_object('provider', providerName, 'identifier', identifier)) AS socials
    FROM auth AS a
    INNER JOIN applicant_data AS ad ON ad.id = a.id
    LEFT JOIN user_roles AS ur ON ur.id = a.id
    LEFT JOIN roles AS r ON r.id = ur.roleId
    LEFT JOIN federated_credentials AS fc ON fc.id = a.id
    LEFT JOIN federated_credentials_provider AS fcp ON fcp.providerID = fc.providerID
    WHERE a.id = uid
    GROUP BY a.id;
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





