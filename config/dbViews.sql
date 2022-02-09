CREATE OR REPLACE VIEW vwUser AS
	SELECT u.uid, email, firstName, middleName, lastName, picture, birthday, phone, gender,
        providerName, identifier, 'User' AS type
    FROM users AS u
    LEFT JOIN federated_credentials AS fc ON fc.uid = u.uid
    LEFT JOIN federated_credentials_provider AS fcp ON fcp.providerID = fc.providerID;

CREATE OR REPLACE VIEW vwCompany AS
    SELECT cid, name, description, address, city, email, website, phone, logo, 'Company' as type
    FROM companies;
