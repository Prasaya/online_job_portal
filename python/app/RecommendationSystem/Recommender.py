from SkillParser import SkillParser
import mysql.connector
from dotenv import dotenv_values
import asyncio
from .utils import computeScore


class Recommender():
    def __init__(self):
        config = dotenv_values("./config/.env")
        self.db = mysql.connector.connect(
            host=config["DB_HOST"],
            user=config["DB_USER"],
            password=config["DB_PASSWORD"],
            database=config["DB_NAME"],
            buffered=True,
        )
        self.parser = SkillParser()

    async def close(self):
        self.db.close()
        await self.parser.close()

    def getUserSkills(self, uid):
        cursor = self.db.cursor()
        cursor.execute(
            "SELECT name, proficiency from applicant_skills WHERE id = %s",
            (uid,)
        )
        return cursor.fetchall()

    def getJobSkills(self, jid):
        cursor = self.db.cursor()
        cursor.execute(
            "SELECT skillName, proficiency from skills where jobId = %s",
            (jid,)
        )
        return cursor.fetchall()

    async def processTuple(self, uid, jid):
        userSkills = [i[0] for i in self.getUserSkills(uid)]
        jobSkills = [i[0] for i in self.getJobSkills(jid)]
        parsedUserSkills = await self.parser.parse(userSkills)
        parsedJobSkills = await self.parser.parse(jobSkills)
        score = await computeScore(parsedUserSkills, parsedJobSkills)
        cursor = self.db.cursor()
        cursor.execute("""
            REPLACE INTO jobMatchScore(applicantId, jobId, score) VALUES(%s, %s, %s)
        """, (uid, jid, score)
        )
        self.db.commit()
        cursor.close()

    async def computeRecommendation(self):
        applicantCursor = self.db.cursor()
        applicantCursor.execute(
            "SELECT id FROM applicant_data"
        )
        jobCursor = self.db.cursor()
        jobCursor.execute(
            "SELECT jobId from jobs"
        )
        applicants = [i[0] for i in applicantCursor]
        jobs = [j[0] for j in jobCursor]
        await asyncio.gather(*[self.processTuple(aId, jId) for aId in applicants for jId in jobs])
