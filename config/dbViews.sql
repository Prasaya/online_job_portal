DROP VIEW IF EXISTS vwUser;
DROP VIEW IF EXISTS vwOrganization;

CREATE OR REPLACE VIEW vwUser AS
	SELECT u.uid, roleName AS role, email, NULL as password, firstName, middleName, lastName, picture, birthday, phone, gender,
        providerName, identifier
    FROM users AS u
    INNER JOIN roles AS r ON r.roleId = u.role
    LEFT JOIN federated_credentials AS fc ON fc.uid = u.uid
    LEFT JOIN federated_credentials_provider AS fcp ON fcp.providerID = fc.providerID;

CREATE OR REPLACE VIEW vwOrganization AS
    SELECT oid, roleName as role, email, password, name, description, address, city, website, phone, logo 
    FROM organizations AS c
    INNER JOIN roles AS r on r.roleId = c.role;
