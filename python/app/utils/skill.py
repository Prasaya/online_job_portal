import asyncio
from Esco import Esco
from utils.db import getDBSkills
esco = Esco()


async def getUserSkills(user):
    rawSkills = getDBSkills(user)
    endpoints = []
    async for skill in getDBSkills(user):
        endpoint = await esco.getEndpoint(skill[0])
        endpoints.append(endpoint)
    skillsDict = {}
    # skillsDict = await esco.createSkillsRow(endpoints)
    return skillsDict


async def getRecommendations(user):
    skills = await getUserSkills(user)
    print(skills)
    return skills
