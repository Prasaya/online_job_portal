DELIMITER |
DROP PROCEDURE IF EXISTS createApplicant |
CREATE PROCEDURE createApplicant(
	IN id CHAR(36),
    IN email vARCHAR(255),
    IN password CHAR(60),
    IN firstName VARCHAR(50),
    IN middleName VARCHAR(50),
    IN lastName VARCHAR(50),
    IN picture VARCHAR(200),
    IN birthday DATE,
    IN phone VARCHAR(20),
    IN gender VARCHAR(10)
)
BEGIN
	INSERT INTO auth (id, email, password, type) VALUES (id, email, password, 'Users');
    INSERT INTO applicant_data (id, firstName, middleName, lastName, picture, birthday, phone, gender)
		VALUES (id, firstName, middleName, lastname, picture, birthday, phone, gender);
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS updateApplicant |
CREATE PROCEDURE updateApplicant(
	IN uid CHAR(36),
    IN uemail VARCHAR(255),
    IN upassword CHAR(60),
    IN ufirstName VARCHAR(50),
    IN umiddleName VARCHAR(50),
    IN ulastName VARCHAR(50),
    IN upicture VARCHAR(200),
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
		IFNULL(uemail, auth.email), IFNULL(upassword, auth.password),
        IFNULL(ufirstName, ad.firstName),IFNULL(umiddleName, ad.middleName),IFNULL(ulastName, ad.lastName),
        IFNULL(upicture, ad.picture),IFNULL(ubirthday, ad.birthday),IFNULL(uphone, ad.phone),
        IFNULL(ugender, ad.gender)
	FROM auth
    INNER JOIN applicant_data AS ad ON ad.id = auth.id
    WHERE auth.id = uid
    INTO uemail, upassword, ufirstName, umiddleName, ulastName, upicture, ubirthday,uphone, ugender;
    
    SELECT uid, uemail, upassword, ufirstName, umiddleName, ulastName, upicture, ubirthday,uphone, ugender;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS createOrganization |
CREATE PROCEDURE createOrganization(
    IN id CHAR(36),
    IN email vARCHAR(255),
    IN password CHAR(60),
    IN name VARCHAR(100),
    IN description VARCHAR(5000),
    IN address VARCHAR(200),
    IN city VARCHAR(100),
    IN website VARCHAR(200),
    IN phone VARCHAR(20),
    IN logo VARCHAR(200)
)
BEGIN
    INSERT INTO auth (id, email, password, type) VALUES (id, email, password, 'Organizations');
    INSERT INTO organization_data (id, name, description, address, city, website, phone, logo)
        VALUES (id, name, description, address, city, website, phone, logo);
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS deleteUser |
CREATE PROCEDURE deleteUser(IN uid CHAR(36))
BEGIN
	DECLARE accType ENUM('Users', 'Organizations');
    SELECT type INTO accType FROM auth WHERE uid = id;
    IF (accType = 'Users') THEN
    BEGIN
		DELETE FROM applicant_academics WHERE id = uid;
        DELETE FROM applicant_skills WHERE id = uid;
		DELETE FROM applicant_data WHERE id = uid;
	END;
    ELSEIF (accType = 'Organizations') THEN
    BEGIN
		DELETE FROM organization_data WHERE id = uid;
	END;
    END IF;
    DELETE FROM user_roles WHERE id = uid;
    DELETE FROM auth WHERE id = uid;
END |
DELIMITER ;

DELIMITER |
DROP PROCEDURE IF EXISTS deleteJobs |
CREATE PROCEDURE deleteJobs(IN jId CHAR(36))
BEGIN
    DELETE FROM skills WHERE jobId = jId;
    DELETE FROM job_qualifications WHERE jobId = jId;
	DELETE FROM jobs WHERE jobId = jId;
END |
DELIMITER ;