import aiohttp

from .DBPedia import DBPedia
from .Esco import Esco
from .utils import computeScore, mergeDictionaries


class SkillParser:
    def __init__(self):
        self.session = aiohttp.ClientSession()
        self.config = {
            'familyWeight': 0.25,
            'paradigmWeight': 0.1,
        }
        self.dbpedia = DBPedia()
        self.esco = Esco()

    async def close(self):
        await self.session.close()
        await self.dbpedia.close()
        await self.esco.close()

    async def getURIandType(self, query):
        '''
        Gets the resource uri and typeName for the given query from dbpedia lookup
        '''
        url = f'https://lookup.dbpedia.org/api/search/'
        params = {'format': 'json', 'maxResults': 3, 'query': query}
        async with self.session.get(url, params=params) as response:
            results = (await response.json())['docs']
            for result in results:
                if 'Software' in result.get('typeName', []):
                    return result["resource"][0], 'Software'
                if 'ProgrammingLanguage' in result.get('typeName', []):
                    return result["resource"][0], 'ProgrammingLanguage'
        return '', None

    async def getSkillType(self, query):
        resourceLink, resourceType = await self.getURIandType(query)
        if (resourceLink == ''):
            query = query + ' programming'
            resourceLink, resourceType = await self.getURIandType(query)
            if (resourceLink == ''):
                return resourceLink, None
        return resourceLink, resourceType

    async def parse(self, skills):
        programmingLanguages = []
        softwares = []
        nonProgrammings = []
        for skill in skills:
            resourceLink, resourceType = await self.getURIandType(skill)
            if(resourceLink == ''):
                nonProgrammings.append(skill)
            elif(resourceType == 'ProgrammingLanguage'):
                programmingLanguages.append(resourceLink)
            elif(resourceType == 'Software'):
                softwares.append(resourceLink)
        languageSkills = await self.dbpedia.parseLanguages(programmingLanguages)
        softwareSkills = await self.dbpedia.parseSoftwares(softwares)
        escoSkills = await self.esco.parse(softwares)
        return mergeDictionaries([languageSkills, escoSkills, softwareSkills])
