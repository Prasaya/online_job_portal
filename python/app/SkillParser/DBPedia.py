import aiohttp
from aiosparql.client import SPARQLClient
from .utils import mergeDictionaries


class DBPedia:
    def __init__(self):
        self.client = SPARQLClient("https://dbpedia.org/sparql")
        self.session = aiohttp.ClientSession()
        self.config = {
            'familyWeight': 0.25,
            'paradigmWeight': 0.1,
        }

    async def close(self):
        await self.client.close()
        await self.session.close()

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

    async def getParadigms(self, skillURI):
        '''
        Returns an array of paradigms for a skill using the given resource link
        '''
        # paradigm may be literal string or URI to another resource. To differentiate,
        # isLiteral is used; for URI, the label is queried for paradigm
        query = f"""
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          SELECT ?result
          WHERE {{
          {{
              <{skillURI}> <http://dbpedia.org/property/paradigm>|<http://dbpedia.org/property/paradigms> ?paradigm.
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

    async def getLanguageFamilies(self, languageURI):
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
            <{languageURI}> dct:subject ?subject.
            ?subject skos:broader*|dct:subject* ?allSubjects.

            filter (?allSubjects = ?families)
          }}
        """
        response = await self.client.query(query)
        results = [row['allSubjects']['value']
                   for row in response['results']['bindings']]
        results = [result.lower() for result in results]
        return results

    async def _parseLanguage(self, languageURI):
        '''
        Construct skill object combining all families and paradigms
        '''
        families = await self.getLanguageFamilies(languageURI)
        paradigms = await self.getParadigms(languageURI)
        skillObject = {}
        for family in families:
            skillObject[family] = self.config['familyWeight']
        for paradigm in paradigms:
            skillObject[paradigm] = self.config['paradigmWeight']
        skillObject[languageURI] = 1
        return skillObject

    async def parseLanguages(self, resourcesURI):
        '''
        Return skills object for the given array of skills
        if C++ java python is given, it returns combined skill object for all
        '''
        skillObjects = [await self._parseLanguage(resource) for resource in resourcesURI]
        return mergeDictionaries(skillObjects)

    async def parseSoftwares(self, resourcesURI):
        output = {}
        for resourceLink in resourcesURI:
            output[resourceLink] = 1
            query = f"""
            PREFIX dbo: <http://dbpedia.org/ontology/>
                SELECT ?language
                Where
                {{
                <{resourceLink}> dbo:programmingLanguage ?language
                }}
            """
            response = await self.client.query(query)
            results = [row['language']['value']
                       for row in response['results']['bindings']]
            for result in results:
                output[result] = 1
        return output
