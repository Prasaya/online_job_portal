-- MySQL dump 10.13  Distrib 8.0.28, for Linux (x86_64)
--
-- Host: localhost    Database: webapp
-- ------------------------------------------------------
-- Server version	8.0.28-0ubuntu0.21.10.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `allJobs`
--

DROP TABLE IF EXISTS `allJobs`;
/*!50001 DROP VIEW IF EXISTS `allJobs`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `allJobs` AS SELECT 
 1 AS `jobId`,
 1 AS `companyId`,
 1 AS `title`,
 1 AS `description`,
 1 AS `vacancies`,
 1 AS `experience`,
 1 AS `address`,
 1 AS `skillName`,
 1 AS `proficiency`,
 1 AS `qid`,
 1 AS `level`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `allJobsFromDatabase`
--

DROP TABLE IF EXISTS `allJobsFromDatabase`;
/*!50001 DROP VIEW IF EXISTS `allJobsFromDatabase`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `allJobsFromDatabase` AS SELECT 
 1 AS `jobId`,
 1 AS `companyId`,
 1 AS `companyName`,
 1 AS `title`,
 1 AS `description`,
 1 AS `deadline`,
 1 AS `vacancies`,
 1 AS `experience`,
 1 AS `address`,
 1 AS `district`,
 1 AS `skills`,
 1 AS `qualifications`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `applicant_academics`
--

DROP TABLE IF EXISTS `applicant_academics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicant_academics` (
  `id` char(36) NOT NULL,
  `qid` int NOT NULL,
  PRIMARY KEY (`id`,`qid`),
  KEY `qid` (`qid`),
  CONSTRAINT `applicant_academics_ibfk_1` FOREIGN KEY (`id`) REFERENCES `applicant_data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `applicant_academics_ibfk_2` FOREIGN KEY (`qid`) REFERENCES `academic_qualifications` (`qid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `applicant_data`
--

DROP TABLE IF EXISTS `applicant_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicant_data` (
  `id` char(36) NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `picture` varchar(200) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `applicant_data_ibfk_1` FOREIGN KEY (`id`) REFERENCES `auth` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `applicant_jobs`
--

DROP TABLE IF EXISTS `applicant_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicant_jobs` (
  `applicantId` char(36) NOT NULL,
  `jobId` char(36) NOT NULL,
  PRIMARY KEY (`applicantId`,`jobId`),
  KEY `jobId` (`jobId`),
  CONSTRAINT `applicant_jobs_ibfk_1` FOREIGN KEY (`applicantId`) REFERENCES `applicant_data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `applicant_jobs_ibfk_2` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`jobId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `applicant_skills`
--

DROP TABLE IF EXISTS `applicant_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicant_skills` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `proficiency` enum('Beginner','Intermediate','Advanced','Expert') NOT NULL,
  `experience` int NOT NULL,
  PRIMARY KEY (`id`,`name`),
  CONSTRAINT `applicant_skills_ibfk_1` FOREIGN KEY (`id`) REFERENCES `applicant_data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `applicant_verification`
--

DROP TABLE IF EXISTS `applicant_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicant_verification` (
  `id` varchar(36) NOT NULL,
  `token` char(100) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `applicant_verification_ibfk_1` FOREIGN KEY (`id`) REFERENCES `auth` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `auth`
--

DROP TABLE IF EXISTS `auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` char(60) DEFAULT NULL,
  `type` enum('Users','Organizations') NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `federated_credentials`
--

DROP TABLE IF EXISTS `federated_credentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `federated_credentials` (
  `id` char(36) NOT NULL,
  `providerId` int NOT NULL,
  `identifier` varchar(2048) NOT NULL,
  PRIMARY KEY (`id`,`providerId`),
  KEY `providerId` (`providerId`),
  CONSTRAINT `federated_credentials_ibfk_1` FOREIGN KEY (`id`) REFERENCES `auth` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `federated_credentials_ibfk_2` FOREIGN KEY (`providerId`) REFERENCES `federated_credentials_provider` (`providerId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `federated_credentials_provider`
--

DROP TABLE IF EXISTS `federated_credentials_provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `federated_credentials_provider` (
  `providerId` int NOT NULL AUTO_INCREMENT,
  `providerName` varchar(50) NOT NULL,
  PRIMARY KEY (`providerId`),
  UNIQUE KEY `providerName` (`providerName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `getJob`
--

DROP TABLE IF EXISTS `getJob`;
/*!50001 DROP VIEW IF EXISTS `getJob`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `getJob` AS SELECT 
 1 AS `jobId`,
 1 AS `companyId`,
 1 AS `title`,
 1 AS `description`,
 1 AS `vacancies`,
 1 AS `experience`,
 1 AS `address`,
 1 AS `district`,
 1 AS `skillName`,
 1 AS `proficiency`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `jobMatchScore`
--

DROP TABLE IF EXISTS `jobMatchScore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobMatchScore` (
  `applicantId` varchar(36) NOT NULL,
  `jobId` varchar(36) NOT NULL,
  `score` float DEFAULT NULL,
  PRIMARY KEY (`applicantId`,`jobId`),
  KEY `jobId` (`jobId`),
  CONSTRAINT `jobMatchScore_ibfk_1` FOREIGN KEY (`applicantId`) REFERENCES `applicant_data` (`id`) ON DELETE CASCADE,
  CONSTRAINT `jobMatchScore_ibfk_2` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`jobId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `job_qualifications`
--

DROP TABLE IF EXISTS `job_qualifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_qualifications` (
  `jobId` char(36) NOT NULL,
  `qId` int NOT NULL,
  PRIMARY KEY (`jobId`,`qId`),
  KEY `qId` (`qId`),
  CONSTRAINT `job_qualifications_ibfk_1` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`jobId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_qualifications_ibfk_2` FOREIGN KEY (`qId`) REFERENCES `academic_qualifications` (`qid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `jobId` char(36) NOT NULL,
  `companyId` char(36) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `vacancies` int NOT NULL,
  `experience` int DEFAULT NULL,
  `address` varchar(1000) DEFAULT NULL,
  `district` varchar(1000) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  PRIMARY KEY (`jobId`),
  KEY `companyId` (`companyId`),
  CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`companyId`) REFERENCES `organization_data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `organization_data`
--

DROP TABLE IF EXISTS `organization_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organization_data` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `logo` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `organization_data_ibfk_1` FOREIGN KEY (`id`) REFERENCES `auth` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(20) NOT NULL,
  `level` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `skillName` varchar(100) NOT NULL,
  `jobId` char(36) NOT NULL,
  `proficiency` enum('Beginner','Intermediate','Advanced') NOT NULL,
  PRIMARY KEY (`skillName`,`jobId`),
  KEY `jobId` (`jobId`),
  CONSTRAINT `skills_ibfk_1` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`jobId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` char(36) NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`id`,`roleId`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`id`) REFERENCES `auth` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'webapp'
--
/*!50003 DROP PROCEDURE IF EXISTS `addApplicantAcademics` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `addApplicantAcademics`(
	IN uid char(36),
	IN academics JSON,
    IN useReplace BOOLEAN
)
BEGIN
	IF (useReplace = true) THEN
		REPLACE INTO applicant_academics (
		SELECT uid AS id, qid
		FROM JSON_TABLE(
			academics,
			'$[*]' COLUMNS (
				qid int PATH "$"
			)
		) AS extracted);

    ELSE
		INSERT INTO applicant_academics (
			SELECT uid AS id, qid
			FROM JSON_TABLE(
				academics,
				'$[*]' COLUMNS (
					qid int PATH "$"
				)
			) AS extracted);
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `addApplicantSkills` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `addApplicantSkills`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `applicantsForJob` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `applicantsForJob`(
	IN jId CHAR(36)
)
BEGIN
	SELECT aj.applicantId, ad.firstName, ad.middleName, ad.lastName, ad.picture, au.email
    FROM applicant_jobs as aj
    INNER JOIN applicant_data as ad on ad.id = aj.applicantId
    INNER JOIN auth as au on au.id = ad.id
    WHERE aj.jobId = jId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `applyForJob` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `applyForJob`(
	applicantId char(36),
    jobId char(36)
)
BEGIN
	INSERT INTO applicant_jobs (applicantId, jobId) VALUES (applicantId, jobId);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `checkExistingUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `checkExistingUser`(
    IN inputEmail VARCHAR(250)
)
BEGIN
    SELECT EXISTS(SELECT email FROM auth WHERE email = inputEmail) AS userExists;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `createApplicant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `createApplicant`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `createOrganization` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `createOrganization`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteExpiredJobs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `deleteExpiredJobs`()
BEGIN
	SET SQL_SAFE_UPDATES = 0;
	DELETE FROM jobs WHERE jobs.deadline < current_date();
	SET SQL_SAFE_UPDATES = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteJobs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `deleteJobs`(IN jId CHAR(36))
BEGIN
    DELETE FROM skills WHERE jobId = jId;
    DELETE FROM job_qualifications WHERE jobId = jId;
	DELETE FROM jobs WHERE jobId = jId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `deleteUser`(IN uid CHAR(36))
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getApplicantJobs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `getApplicantJobs`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getAuthDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `getAuthDetails`(
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
    -- LEFT JOIN federated_credentials AS fc ON fc.id = a.id
-- 	LEFT JOIN federated_credentials_provider AS fcp on fcp.providerId = fc.providerID
	WHERE email = inputEmail
	GROUP BY a.id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getCompanyJobsData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `getCompanyJobsData`(
    IN oid CHAR(36)
)
BEGIN
	SELECT j.jobId AS jobId, j.companyId as companyId, od.name as companyName, j.title, j.description,
		j.vacancies, j.experience, j.address, j.district, j.deadline,
		JSON_ARRAYAGG(json_object('skillName', s.skillName, 'proficiency', s.proficiency)) AS skills,
        (SELECT
			JSON_ARRAYAGG(
				JSON_OBJECT('qid', q.qid, 'level', aq.level, 'discipline', aq.discipline, 'degree', aq.degree)
			)
			FROM job_qualifications AS q
			INNER JOIN jobs AS jb on jb.jobId = q.jobId
			INNER JOIN academic_qualifications AS aq ON q.qid = aq.qid
            WHERE jb.companyId = oid AND q.jobId = j.jobId
			GROUP BY q.jobId
        ) as qualifications
    FROM jobs AS j
    LEFT JOIN skills AS s ON s.jobId = j.jobId
    INNER JOIN organization_data as od ON j.companyId = od.id
    WHERE j.companyId = oid
    GROUP BY j.jobId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getJobFromId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `getJobFromId`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getJobFromIdWhere` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `getJobFromIdWhere`(
    IN jId CHAR(36)
)
BEGIN
	SELECT j.jobId, j.companyId, organization_data.name as companyName, j.title,
		j.description, j.vacancies, j.experience, j.address, j.district,
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getOrganizationData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `getOrganizationData`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getQualifications` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `getQualifications`()
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getUserData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `getUserData`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `updateApplicant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`webapp`@`localhost` PROCEDURE `updateApplicant`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `allJobs`
--

/*!50001 DROP VIEW IF EXISTS `allJobs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`webapp`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `allJobs` AS select `j`.`jobId` AS `jobId`,`j`.`companyId` AS `companyId`,`j`.`title` AS `title`,`j`.`description` AS `description`,`j`.`vacancies` AS `vacancies`,`j`.`experience` AS `experience`,`j`.`address` AS `address`,`s`.`skillName` AS `skillName`,`s`.`proficiency` AS `proficiency`,`aq`.`qid` AS `qid`,`aq`.`level` AS `level` from (((`jobs` `j` left join `skills` `s` on((`j`.`jobId` = `s`.`jobId`))) left join `job_qualifications` `q` on((`q`.`jobId` = `j`.`jobId`))) left join `academic_qualifications` `aq` on((`aq`.`qid` = `q`.`qId`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `allJobsFromDatabase`
--

/*!50001 DROP VIEW IF EXISTS `allJobsFromDatabase`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`webapp`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `allJobsFromDatabase` AS select `j`.`jobId` AS `jobId`,`j`.`companyId` AS `companyId`,`o`.`name` AS `companyName`,`j`.`title` AS `title`,`j`.`description` AS `description`,`j`.`deadline` AS `deadline`,`j`.`vacancies` AS `vacancies`,`j`.`experience` AS `experience`,`j`.`address` AS `address`,`j`.`district` AS `district`,(select json_arrayagg(json_object('name',`s`.`skillName`,'proficiency',`s`.`proficiency`)) from `skills` `s` where (`s`.`jobId` = `j`.`jobId`) group by `s`.`jobId`) AS `skills`,(select json_arrayagg(json_object('qid',`q`.`qId`,'level',`aq`.`level`,'discipline',`aq`.`discipline`,'degree',`aq`.`degree`)) from ((`job_qualifications` `q` join `jobs` `jb` on((`jb`.`jobId` = `q`.`jobId`))) join `academic_qualifications` `aq` on((`q`.`qId` = `aq`.`qid`))) where (`q`.`jobId` = `j`.`jobId`) group by `q`.`jobId`) AS `qualifications` from (`jobs` `j` join `organization_data` `o` on((`o`.`id` = `j`.`companyId`))) group by `j`.`jobId` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `getJob`
--

/*!50001 DROP VIEW IF EXISTS `getJob`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`webapp`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `getJob` AS select `j`.`jobId` AS `jobId`,`j`.`companyId` AS `companyId`,`j`.`title` AS `title`,`j`.`description` AS `description`,`j`.`vacancies` AS `vacancies`,`j`.`experience` AS `experience`,`j`.`address` AS `address`,`j`.`district` AS `district`,`s`.`skillName` AS `skillName`,`s`.`proficiency` AS `proficiency` from (`jobs` `j` join `skills` `s` on((`s`.`jobId` = `j`.`jobId`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-09 14:16:09
