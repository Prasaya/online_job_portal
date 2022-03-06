from audioop import mul
from aiosparql.client import SPARQLClient
import aiohttp
import asyncio


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

    async def init(self):
        self.client = SPARQLClient("http://localhost:3030/esco/query")
        self.session = aiohttp.ClientSession()

    async def __aenter__(self):
        return self

    async def __aexit__(self, *excinfo):
        await self.close()

    async def close(self):
        await self.session.close()
        await self.client.close()

    async def getEndpoint(self, query, limit=1):
        url = "https://ec.europa.eu/esco/api/search/"
        params = {
            'text': query,
            'limit': limit,
            'language': 'en',
            # 'viewObsolete': False,
        }
        async with self.session.get(url, params=params) as response:
            results = (await response.json())['_embedded']['results']
            return [i['uri']for i in results]

    async def getLength(self, start, end):
        query = f"""
        {self.prefixes}
        prefix start: <{start}>
        prefix end: <{end}>
        SELECT  (count(?mid) as ?length)
        WHERE
        {{
            start: skos:narrower* ?mid .
            ?mid   skos:narrower+ end: .
        }}
        """
        results = await self.client.query(query)
        return results['results']['bindings'][0]['length']['value']

    async def getLevel(self, end):
        bases = [
            'http://data.europa.eu/esco/skill/K',
            'http://data.europa.eu/esco/skill/S',
            'http://data.europa.eu/esco/skill/T',
        ]
        return max(await asyncio.gather(*[self.getLength(base, end) for base in bases]))

    async def getScores(self, start):
        query = f"""
        {self.prefixes}
        prefix start: <{start}>
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
        self.dfs(graph, start, None, results)
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

    def mergeDicts(self, dictionaries):
        output = {}
        for dictionary in dictionaries:
            for key, value in dictionary.items():
                if key in output:
                    output[key] = max(output[key], value)
                else:
                    output[key] = value
        return output

    async def createSkillsRow(self, skillsURI):
        scores = [(await self.getScores(uri)) for uri in skillsURI]
        return self.mergeDicts(scores)
