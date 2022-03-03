import aiohttp
import asyncio
from SPARQLWrapper import SPARQLWrapper, JSON
import json

sparql = SPARQLWrapper("http://localhost:3030/esco/sparql")
prefixes = """
PREFIX esc: <https://solid.ti.rw.fau.de/public/ns/event-sourcing-containers#>
PREFIX es: <http://eulersharp.sourceforge.net/2003/03swap/log-rules#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX td: <https://www.w3.org/2019/wot/td#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX skosxl: <http://www.w3.org/2008/05/skos-xl#>
PREFIX esco: <http://data.europa.eu/esco/model#>
PREFIX text: <http://jena.apache.org/text#>
prefix local: <http://localhost/esco/#>
prefix wikibase: <http://wikiba.se/ontology#>
"""


async def getLength(start, end):
    query = f"""
      {prefixes}
      prefix start: <{start}>
      prefix end: <{end}>
      SELECT  (count(?mid) as ?length)
      WHERE
      {{
        start: skos:narrower* ?mid .
        ?mid   skos:narrower+ end: .
      }}
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    return results['results']['bindings'][0]['length']['value']


async def getLevel(end):
    bases = [
        'http://data.europa.eu/esco/skill/K',
        'http://data.europa.eu/esco/skill/S',
        'http://data.europa.eu/esco/skill/T',
    ]
    return max(await asyncio.gather(*[getLength(base, end) for base in bases]))


def getChildren(parent):
    query = f"""
    {prefixes}
    prefix parent: <{parent}>
    SELECT distinct ?child
    WHERE
    {{
      parent: skos:narrower* ?child .
    }}
  """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    return [result['child']['value'] for result in results['results']['bindings']]


data = {}

visited = set()


def dfs(root, level):
    childrens = getChildren(root)
    if len(childrens) == 0:
        return
    for child in childrens:
        data[child] = max(data.get(child, 0), level) + 1
        if child in visited:
            #data [child] = current
            # data [child] = possible value
            # possible value = max(current, possible value) 
            print("Duplicate node")
            print(child)
            continue
        visited.add(child)
        dfs(child, level + 1)


def main():
    root = 'http://data.europa.eu/esco/skill/S8.8'
    data = (getChildren(root))
    dfs(root, 0)
    with open('skills.json', 'w') as f:
        json.dump(data, f, indent=4)


if __name__ == '__main__':
    main()
    # loop = asyncio.get_event_loop()
    # loop.run_until_complete(main())
