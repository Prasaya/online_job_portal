from aiosparql.client import SPARQLClient
import aiohttp
import asyncio
import json


class Esco:
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
        response = await self.session.get(url, params=params)
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

    def getChildren(self, parent):
        query = f"""
        {self.prefixes}
        prefix parent: <{parent}>
        SELECT distinct ?child
        WHERE
        {{
            parent: skos:narrower* ?child .
        }}
        """
        results = self.client.query()
        return results['results']


async def main():
    esco = Esco()
    data = await esco.getEndpoint("identify market niches")
    start = 'http://data.europa.eu/esco/skill/S'
    root = 'http://data.europa.eu/esco/skill/S1.1.1.1'
    print(await esco.getLength(start, root))

if __name__ == '__main__':
    # main()
    asyncio.run(main())
