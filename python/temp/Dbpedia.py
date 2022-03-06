import aiohttp;
import asyncio;
from SPARQLWrapper import SPARQLWrapper, JSON

async def getResource(query):
  url = f'https://lookup.dbpedia.org/api/search/'
  params = {'format': 'json', 'maxResults': '3', 'query': query}
  async with aiohttp.ClientSession() as session:
    async with session.get(url, params=params) as response:
      results = (await response.json())['docs']
      for result in results:
        if 'Software' in result['typeName']:
          return result["resource"][0], 'Software'
        if 'ProgrammingLanguage' in result['typeName']:
          return result["resource"][0], 'ProgrammingLanguage'
  return '', None

def getParadigm(resourceLink):
  sparql = SPARQLWrapper("http://dbpedia.org/sparql")
  query = """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?result
    WHERE {{
      <{resourceLink}> {predicate} ?paradigm.
      OPTIONAL {{?paradigm rdfs:label ?label}}.
      bind ( IF( isLiteral(?paradigm), ?paradigm, ?label ) as ?result ).
      filter langMatches(lang(?result), 'EN')
    }}
  """
  sparql.setQuery(query.format(resourceLink=resourceLink, predicate='<http://dbpedia.org/property/paradigm>'))
  sparql.setReturnFormat(JSON)
  convertedResults = sparql.query().convert()
  paradigms = [result['result']['value'] for result in convertedResults['results']['bindings']]
  if len(paradigms) == 0:
    # There is no paradigm for C++ but there is paradigms
    sparql.setQuery(query.format(resourceLink=resourceLink, predicate='<http://dbpedia.org/property/paradigms>'))
    sparql.setReturnFormat(JSON)
    convertedResults = sparql.query().convert()
    paradigms = [result['result']['value'] for result in convertedResults['results']['bindings']]
  return paradigms

async def createDbpediaArray(query):
  resourceLink, resourceType = await getResource(query)
  if (resourceLink == ''):
    query = query + ' programming'
    resourceLink, resourceType = await getResource(query)
    if (resourceLink == ''):
      raise 'Not Software or programming Language'
  return getParadigm(resourceLink)

async def main():
  print(await createDbpediaArray('c++'))
loop = asyncio.get_event_loop()
# loop.run_until_complete(main())



# PREFIX dbo: <http://dbpedia.org/ontology/>
# SELECT *
# WHERE {
# <http://dbpedia.org/resource/React_(JavaScript_library)> dbo:programmingLanguage ?language.
# /|\ format - <{variableLink} dbo:programmingLanguage ?language.
# }

def formatMultiParadigm(results):
  prefix = "Multi-paradigm: "
  if( results[0].startswith(prefix) ) :
    results[0] = results[0].removeprefix(prefix)
    temp = results[0].split(", ")
    results = temp

    for i, paradigm in enumerate(results):
      paradigm = paradigm.strip()
      paradigm += ' programming'
      results[i] = paradigm

  return results

def constructParadigm(resourceLink):
  sparql = SPARQLWrapper("http://dbpedia.org/sparql")
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
  
  sparql.setQuery(query)
  sparql.setReturnFormat(JSON)
  response = sparql.query().convert()
  
  results = []
  for result in response['results']['bindings']:
    data = result['result']['value']
    results.append(data)
  if( len(results) == 1 ):
    print(results)
    results = formatMultiParadigm(results)
  
  results = [result.lower() for result in results]

  print(results)


print(constructParadigm('http://dbpedia.org/resource/C++'))





