import asyncio

from numpy import sometrue
import mysql.connector
from dotenv import dotenv_values


class AcademicQualification:
    def __init__(self):
        config = dotenv_values("./config/.env")
        self.db = mysql.connector.connect(
            host=config["DB_HOST"],
            user=config["DB_USER"],
            password=config["DB_PASSWORD"],
            database=config["DB_NAME"],
        )
        self.cached = None
        self.lock = asyncio.Lock()

    async def academicData(self):
        """
        Creates row array of all academic qualifications
        Return value contains qid as key and list of qids associated as values
        For qid of 1; ("Masters", "ALL_DISCIPLINES", "ALL_DEGREES") result[1] contains
        list of all qids associated with Masters
        The result is cached in global variable cached
        """
        # if something is updating do nothing; don't know if it is thread safe
        async with self.lock:
            if self.cached is not None:
                return self.cached
            # Store final result
            # {qid: [qids]}
            temp = {}
            # Store list of qid whose discipline is ALL_DISCIPLINES ordered by level
            # {level: qid}
            allDisciplineQid = {}
            # Store list of qid whose degree is ALL_DEGREES ordered by discipline, level
            # {discipline: {level: qid}}
            allDegreeQid = {}
            # {level: {discipline: [qid, qid, ...]}}
            qidByLevelDiscipline = {}
            cursor = self.db.cursor()
            cursor.execute("""
                SELECT qid, level, discipline, degree from academic_qualifications
            """)
            for qid, level, discipline, degree in cursor:
                temp[qid] = set()
                temp[qid].add(qid)
                if discipline == 'ALL_DISCIPLINES':
                    allDisciplineQid[level] = qid
                elif degree == 'ALL_DEGREES':
                    if discipline not in allDegreeQid:
                        allDegreeQid[discipline] = {}
                    allDegreeQid[discipline][level] = qid
                if level not in qidByLevelDiscipline:
                    qidByLevelDiscipline[level] = {}
                if discipline not in qidByLevelDiscipline[level]:
                    qidByLevelDiscipline[level][discipline] = set()
                qidByLevelDiscipline[level][discipline].add(qid)
            # For each qid with discipline ALL_DISCIPLINES add all qids with same level
            for level, qid in allDisciplineQid.items():
                temp[qid] = temp[qid].union(
                    set([j for i in qidByLevelDiscipline[level].values()
                        for j in i])
                )
            # For each qid with degree ALL_DEGREES add all qids with same discipline and level
            for discipline, levelQid in allDegreeQid.items():
                for level, qid in levelQid.items():
                    temp[qid] = temp[qid].union(
                        qidByLevelDiscipline[level][discipline]
                    )
            self.cached = temp
            return cached

    async def getUserAcademics(self, uid):
        cursor = self.db.cursor()
        cursor.execute("""
        SELECT qid FROM applicant_academics WHERE id = %s
        """, (uid,))
        return [i[0] for i in cursor.fetchall()]

    async def getJobAcademics(self, jid):
        cursor = self.db.cursor()
        cursor.execute("""
        SELECT qid FROM job_qualifications WHERE jobId = %s
        """, (jid,))
        return [i[0] for i in cursor.fetchall()]

    async def determineAcademicCompatibility(self, user, job):
        rowData = await self.academicData()
        userAcademics = await self.getUserAcademics(user)
        jobAcademics = await self.getJobAcademics(job)
        valid = []
        for jobAcademic in jobAcademics:
            accepted = rowData[jobAcademic]
            if sometrue([i in userAcademics for i in accepted]):
                valid.append(jobAcademic)
        return len(valid)/len(jobAcademics)
