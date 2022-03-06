import json
import resource
import aiohttp
import asyncio
from aiosparql.client import SPARQLClient
from utils.skill import computeScore
from Esco import Esco
from Dbpedia import DBPedia

class Skills:
    def __init__(self):
        self.prefixes = """
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            PREFIX skosxl: <http://www.w3.org/2008/05/skos-xl#>
            PREFIX esco: <http://data.europa.eu/esco/model#>
            PREFIX text: <http://jena.apache.org/text#>
        """
        self.client = SPARQLClient("https://dbpedia.org/sparql")
        self.session = aiohttp.ClientSession()
        self.config = {
            'familyWeight': 0.25,
            'paradigmWeight': 0.1,
        }
        self.dbpedia = DBPedia()
        self.esco = Esco()

    async def close(self):
        await self.client.close()
        await self.session.close()
        await self.dbpedia.close()
        await self.esco.close()

    def mergeDictionaries(self, dictionaries):
        '''
        Merges all dictionaries into one
        '''
        output = {}
        for dictionary in dictionaries:
            for key, value in dictionary.items():
                if key in output:
                    output[key] = max(output[key], value)
                else:
                    output[key] = value
        return output

    async def getResource(self, query):
        '''
        Gets the resource link and typeName for the given query from dbpedia lookup
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
        resourceLink, resourceType = await self.getResource(query)
        if (resourceLink == ''):
            query = query + ' programming'
            resourceLink, resourceType = await self.getResource(query)
            if (resourceLink == ''):
                return resourceLink, None
        return resourceLink, resourceType


    async def parseSkills (self, skills):
        programmingLanguages = []
        softwares = []
        nonProgrammings = []
        for skill in skills:
            resourceLink, resourceType = await self.getResource(skill)
            if(resourceLink == ''):
                nonProgrammings.append(skill)
            elif(resourceType == 'ProgrammingLanguage'):
                programmingLanguages.append(resourceLink)
            elif(resourceType == 'Software'):
                softwares.append(resourceLink)
        
        programmingSkills = await self.dbpedia.getSkills(programmingLanguages)
        endPoints = [(await self.esco.getEndpoint(skill))[0] for skill in nonProgrammings]
        escoSkills = await self.esco.createSkillsRow(endPoints)
        softwareSkills = await self.dbpedia.getSoftwareSkills(softwares)
        
        # print(programmingSkills, '\n\n', escoSkills, '\n\n', softwareSkills)
        return self.mergeDictionaries([programmingSkills, escoSkills, softwareSkills])



    async def getSkillsComparedScore(self, jobSkillsArray, userSkillsArray):
        
        userSkills = await self.getSkills(userSkillsArray)
        jobSkills = await self.getSkills(jobSkillsArray)
        score = await computeScore(userSkills, jobSkills)
        return score
