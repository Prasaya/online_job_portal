CREATE OR REPLACE VIEW allJobsFromDatabase AS
SELECT j.jobId, j.companyId, o.name as companyName, j.title, j.description, j.vacancies, j.experience, j.address,
	(SELECT
		JSON_ARRAYAGG(
			JSON_OBJECT('name', s.skillName, 'proficiency', s.proficiency)
		)
		FROM skills AS s
        WHERE s.jobId = j.jobId
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
INNER JOIN organization_data AS o ON o.id = j.companyId
GROUP BY j.jobId;