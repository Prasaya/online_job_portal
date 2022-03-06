import json
import aiohttp
import asyncio
from aiosparql.client import SPARQLClient
from utils.skill import computeScore


class DBPedia:
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

    async def close(self):
        await self.client.close()
        await self.session.close()

    async def getResource(self, query):
        '''
        Gets the resource link and typeName for the given query from dbpedia lookup
        '''
        url = f'https://lookup.dbpedia.org/api/search/'
        params = {'format': 'json', 'maxResults': 1, 'query': query}
        async with self.session.get(url, params=params) as response:
            results = (await response.json())['docs']
            for result in results:
                if 'Software' in result['typeName']:
                    return result["resource"][0], 'Software'
                if 'ProgrammingLanguage' in result['typeName']:
                    return result["resource"][0], 'ProgrammingLanguage'
        return '', None

    async def createDbpediaArray(self, query):
        resourceLink, _ = await self.getResource(query)
        if (resourceLink == ''):
            query = query + ' programming'
            resourceLink, resourceType = await self.getResource(query)
            if (resourceLink == ''):
                raise 'Not Software or programming Language'
        return await self.constructParadigm(resourceLink)

    def formatMultiParadigm(self, result: str):
        '''
        If paradigm of a language has single string multi-paradigm
        Returns an array of paradigms
        '''
        prefix = "Multi-paradigm: "
        if(result[0].startswith(prefix)):
            result[0] = result[0].removeprefix(prefix)
            temp = result[0].split(", ")
            result = temp
            for i, paradigm in enumerate(result):
                paradigm = paradigm.strip()
                paradigm += ' programming'
                result[i] = paradigm
        return result

    async def constructParadigm(self, resourceLink):
        '''
        Returns an array of paradigms for a skill using the given resource link
        '''
        # pradigm is binded to check if paradigms are multi-paradigm and in a single string
        query = f"""
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          SELECT ?result
          WHERE {{
          {{
              <{resourceLink}> <http://dbpedia.org/property/paradigm>|<http://dbpedia.org/property/paradigms> ?paradigm.
              OPTIONAL {{?paradigm rdfs:label ?label}}.
              bind ( IF( isLiteral(?paradigm), ?paradigm, ?label ) as ?result ).
              filter langMatches(lang(?result), 'EN')
          }}
          }}
        """
        response = await self.client.query(query)
        results = [row['result']['value']
                   for row in response['results']['bindings']]
        if(len(results) == 1):
            results = self.formatMultiParadigm(results)
        results = [result.lower() for result in results]
        if('programming paradigm' in results):
            results.remove('programming paradigm')
        return results

    async def constructFamily(self, resourceLink):
        '''
        Returns an array of families for a skill using the given resource link
        '''
        query = f"""
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          PREFIX dct: <http://purl.org/dc/terms/>

          SELECT DISTINCT ?allSubjects
          WHERE {{
            ?families skos:broader <http://dbpedia.org/resource/Category:Programming_language_families>.
            <{resourceLink}> dct:subject ?subject.
            ?subject skos:broader*|dct:subject* ?allSubjects.

            filter (?allSubjects = ?families)
          }}
        """
        response = await self.client.query(query)
        results = [row['allSubjects']['value']
                   for row in response['results']['bindings']]
        results = [result.lower() for result in results]
        return results

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

    async def getSkillObject(self, resourceLink):
        '''
        Construct skill object combining all families and paradigms
        paradigms are given score 0.25
        families are given score 0.75
        '''
        families = await self.constructFamily(resourceLink)
        paradigms = await self.constructParadigm(resourceLink)
        skillObject = {}
        for family in families:
            skillObject[family] = self.config['familyWeight']
        for paradigm in paradigms:
            skillObject[paradigm] = self.config['paradigmWeight']
        return skillObject

    async def getResourceLinks(self, skills):
        '''
        Function returns an array of resource links for the given array of skills
        '''
        resourceArray = []
        for skill in skills:
            resourceLink = await self.getResource(skill)
            resourceLink = resourceLink[0]
            resourceArray.append(resourceLink)
        return resourceArray

    async def getSkills(self, skills):
        '''
        Return skills object for the given array of skills
        if C++ java python is given, it returns combined skill object for all
        '''
        resourceArray = await self.getResourceLinks(skills)
        skillObjects = [await self.getSkillObject(resource) for resource in resourceArray]
        return self.mergeDictionaries(skillObjects)

    async def getSkillsComparedScore(self, jobSkillsArray, userSkillsArray):
        userSkills = await self.getSkills(userSkillsArray)
        jobSkills = await self.getSkills(jobSkillsArray)
        score = await computeScore(userSkills, jobSkills)
        return score
