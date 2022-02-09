DELIMITER |

DROP PROCEDURE IF EXISTS getAuthDetails |
CREATE PROCEDURE getAuthDetails(
    IN inputEmail VARCHAR(250)
)
BEGIN
    IF EXISTS(
        SELECT uid FROM  users
        WHERE users.email = inputEmail
    ) THEN
    BEGIN
        SELECT u.uid as id, email, password, 'User' AS type
        FROM users AS u
        LEFT JOIN federated_credentials AS fc ON fc.uid = u.uid
        LEFT JOIN federated_credentials_provider AS fcp on fcp.providerId = fc.providerID
        WHERE email = inputEmail;
    END;
    ELSEIF EXISTS(
        SELECT cid FROM companies
        WHERE companies.email = inputEmail
    ) THEN
    BEGIN
        SELECT cid as id, email, password, 'Company' AS type
        FROM companies AS c
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
    DECLARE type VARCHAR(10);
    SELECT uid into id FROM users WHERE users.email = inputEmail;
    IF isnull(id) THEN
    BEGIN
		SELECT cid into id FROM companies WHERE companies.email = inputEmail;
        IF NOT isnull(id) THEN
			SET type = 'Company';
		END IF;
	END;
    ELSE
	BEGIN
		SET type = 'User';
	END;
    END IF;
    SELECT id, type;

END |
DELIMITER ;