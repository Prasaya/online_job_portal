from Esco import Esco
from utils.db import db
from scipy.spatial import distance


async def getDBSkills(uid):
    cursor = db.cursor()
    cursor.execute("""
        SELECT name, proficiency, experience from applicant_skills WHERE id = %s
    """, (uid,))
    return cursor.fetchall()


async def getUserSkills(user, esco: Esco):
    endpoints = []
    for skill in (await getDBSkills(user)):
        endpoint = await esco.getEndpoint(skill[0], 1)
        endpoints.append(endpoint[0])
    skillsDict = await esco.createSkillsRow(endpoints)
    return skillsDict


async def computeScore(userSkills, jobSkills):
    keys = {}
    index = 0
    userRow = []
    jobRow = []
    for key, value in userSkills:
        keys[key] = index
        index += 1
        userRow.append(value)
        jobRow.append(jobSkills.get(key, 0))
    for key, value in jobSkills:
        if key not in keys:
            keys[key] = index
            index += 1
            userRow.append(0)
            jobRow.append(value)
    return distance.cosine(userRow, jobRow)


async def getRecommendations(user):
    skills = await getUserSkills(user)
    return skills
