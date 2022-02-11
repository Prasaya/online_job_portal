DELIMITER |
DROP PROCEDURE IF EXISTS getAuthDetails |
CREATE PROCEDURE getAuthDetails(
    IN inputEmail VARCHAR(255)
)
BEGIN
    IF EXISTS(
        SELECT uid FROM  users
        WHERE users.email = inputEmail
    ) THEN
    BEGIN
        SELECT u.uid as id, email, password, roleName as role,
            JSON_ARRAYAGG(json_object('provider', providerName, 'identifier', identifier)) AS socials
        FROM users AS u
        INNER JOIN roles AS r on r.roleId = u.role
        LEFT JOIN federated_credentials AS fc ON fc.uid = u.uid
        LEFT JOIN federated_credentials_provider AS fcp on fcp.providerId = fc.providerID
        WHERE email = inputEmail
        GROUP BY u.uid;
    END;
    ELSEIF EXISTS(
        SELECT oid FROM organizations
        WHERE organizations.email = inputEmail
    ) THEN
    BEGIN
        SELECT oid as id, email, password, roleName as role
        FROM organizations AS o
        INNER JOIN roles AS r on r.roleId = o.role
        WHERE email = inputEmail;
    END;

    END IF;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS checkExistingUser |
CREATE PROCEDURE checkExistingUser(
    IN inputEmail VARCHAR(250)
)
BEGIN
    DECLARE id VARCHAR(36);
    DECLARE idType VARCHAR(20);
    SELECT uid, roleName into id, idType
    FROM users AS u
    INNER JOIN roles AS r on r.roleId = u.role
    WHERE email = inputEmail;
    IF isnull(id) THEN
    BEGIN
		SELECT oid, roleName into id, idType
        FROM organizations AS o
        INNER JOIN roles AS r on r.roleId = o.role
        WHERE email = inputEmail;
	END;
    END IF;
    SELECT id, idType;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS getUserData |
CREATE PROCEDURE getUserData(
    IN uid CHAR(36)
)
BEGIN
    SELECT u.uid AS id, roleName AS role, email, NULL as password, firstName, middleName, lastName,
        picture, birthday, phone, gender,
        JSON_ARRAYAGG(json_object('provider', providerName, 'identifier', identifier)) AS socials
    FROM users AS u
    INNER JOIN roles AS r ON r.roleId = u.role
    LEFT JOIN federated_credentials AS fc ON fc.uid = u.uid
    LEFT JOIN federated_credentials_provider AS fcp ON fcp.providerID = fc.providerID
    WHERE u.uid = uid
    GROUP BY u.uid;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS getOrganizationData |
CREATE PROCEDURE getOrganizationData(
    IN oid CHAR(36)
)
BEGIN
    SELECT o.oid as id, roleName AS role, email, NULL as password, name, description, address, city,
        website, phone, logo
    FROM organizations AS o
    INNER JOIN roles AS r ON r.roleId = o.role
    WHERE o.oid = oid;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS getQualifications;
CREATE PROCEDURE getQualifications()
BEGIN
	SELECT level, json_arrayagg(disc_deg) AS data FROM
	(
		SELECT
			level,
			json_object(discipline, json_arrayagg(json_object('id', qid, 'name', degree))) AS disc_deg
		FROM academic_qualifications GROUP BY level, discipline
	) AS disc
	GROUP BY level;
END |
DELIMITER ;

