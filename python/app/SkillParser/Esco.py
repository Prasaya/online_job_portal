from aiosparql.client import SPARQLClient
import aiohttp
import asyncio
from .utils import mergeDictionaries


class Esco:
    def __init__(self):
        asyncio.set_event_loop(asyncio.SelectorEventLoop())
        self.prefixes = """
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            PREFIX skosxl: <http://www.w3.org/2008/05/skos-xl#>
            PREFIX esco: <http://data.europa.eu/esco/model#>
            PREFIX text: <http://jena.apache.org/text#>
        """
        self.client = SPARQLClient("http://localhost:3030/esco/query")
        self.session = aiohttp.ClientSession()

    async def __aenter__(self):
        return self

    async def __aexit__(self, *excinfo):
        await self.close()

    async def close(self):
        await self.session.close()
        await self.client.close()

    async def getURI_sparql(self, query):
        query = f"""
            {self.prefixes}
            SELECT ?uri
            WHERE {{
                ?uri text:query "{query}" .
            }}
        """
        response = await self.client.query(query)
        return [response['results']['bindings'][0]['uri']['value']]

    async def getURI(self, query, limit=1):
        url = "http://ec.europa.eu/esco/api/search/"
        params = {
            'text': query,
            'limit': limit,
            'language': 'en',
            # 'viewObsolete': False,
        }
        async with self.session.get(url, params=params) as response:
            results = (await response.json())['_embedded']['results']
            return [i['uri']for i in results]

    async def getScores(self, startURI):
        query = f"""
        {self.prefixes}
        prefix start: <{startURI}>
        SELECT distinct ?mid ?broad
        WHERE {{
            start: skos:broader* ?mid .
            ?mid skos:broader ?broad
        }}
        """
        response = await self.client.query(query)
        graph = {}
        for result in response['results']['bindings']:
            node = result['mid']['value']
            parent = result['broad']['value']
            if node not in graph:
                graph[node] = []
            graph[node].append(parent)
        results = {}
        self.dfs(graph, startURI, None, results)
        return results

    def dfs(self, graph, root, parent, results, multiplier=0.5):
        """
        Create a dict of skill to scores for each node
        """
        if root in results:
            oldScore = results[root]
            newScore = results[parent] * multiplier
            if oldScore >= newScore:
                return
        if parent is None:
            results[root] = 1
        else:
            results[root] = results[parent] * multiplier
        for child in graph.get(root, []):
            self.dfs(graph, child, root, results)

    async def _parseSkill(self, skillsURI):
        scores = await asyncio.gather(*[self.getScores(uri) for uri in skillsURI])
        return mergeDictionaries(scores)

    async def parse(self, skills):
        uris = await asyncio.gather(*[self.getURI(skill) for skill in skills])
        skillsDicts = await asyncio.gather(*[self._parseSkill(uri) for uri in uris])
        return mergeDictionaries(skillsDicts)

    async def parseFromURI(self, uris):
        skillsDicts = await asyncio.gather(*[self._parseSkill(uri) for uri in uris])
        return mergeDictionaries(skillsDicts)
