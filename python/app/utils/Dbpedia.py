import aiohttp;
import asyncio;
from SPARQLWrapper import SPARQLWrapper, JSON
from skill import computeScore

sparql = SPARQLWrapper("http://dbpedia.org/sparql")

async def getResource(query):
  '''
  Gets the resource link and typeName for the given query from dbpedia lookup
  '''
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

async def createDbpediaArray(query):
  resourceLink, resourceType = await getResource(query)
  if (resourceLink == ''):
    query = query + ' programming'
    resourceLink, resourceType = await getResource(query)
    if (resourceLink == ''):
      raise 'Not Software or programming Language'
  return constructParadigm(resourceLink)

# async def main():
#   print(await createDbpediaArray('c++'))
# loop = asyncio.get_event_loop()
# loop.run_until_complete(main())

# PREFIX dbo: <http://dbpedia.org/ontology/>
# SELECT *
# WHERE {
# <http://dbpedia.org/resource/React_(JavaScript_library)> dbo:programmingLanguage ?language.
# /|\ format - <{variableLink} dbo:programmingLanguage ?language.
# }

def formatMultiParadigm(results):
  '''
  If paradigm of a language has single string multi-paradigm
  Returns an array of paradigms
  '''
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
  '''
  Returns an array of paradigms for a skill using the given resource link
  '''
  # pradigm is binded to check if paradigms are multi-paradigm and in a single string
  global sparql
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
    results = formatMultiParadigm(results)
  
  results = [result.lower() for result in results]
  if( 'programming paradigm' in results ):
    results.remove('programming paradigm')
  return  results

# print(constructParadigm('http://dbpedia.org/resource/C++'))

def constructFamily(resourceLink):
  '''
  Returns an array of families for a skill using the given resource link
  '''
  global sparql
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
  
  sparql.setQuery(query)
  sparql.setReturnFormat(JSON)
  response = sparql.query().convert()
  # print(response)
  results = []
  for result in response['results']['bindings']:
    data = result['allSubjects']['value']
    results.append(data)
  
  results = [result.lower() for result in results]
  return results


def merge_dictionaries(dictionaries):
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


def getSkillObject(resourceLink):
  '''
  Construct skill object combining all families and paradigms
  paradigms are given score 0.25
  families are given score 0.75
  '''
  families = constructFamily(resourceLink)
  paradigms = constructParadigm(resourceLink)
  
  skillObject = {} 
  for family in families:
    skillObject[family] = 0.75
  for paradigm in paradigms:
    skillObject[paradigm] = 0.25  
  return skillObject  


# print( getSkillObject('http://dbpedia.org/resource/Java_(programming_language)') )
# print(constructFamily('http://dbpedia.org/resource/C++'))

async def getResourceLinks (skills):
  '''
  Function returns an array of resource links for the given array of skills
  '''
  resourceArray = []
  for skill in skills:
    resourceLink = await getResource(skill)
    resourceLink = resourceLink[0]
    resourceArray.append(resourceLink)
  return resourceArray

async def getSkills(skills):
  '''
  Return skills object for the given array of skills
  if C++ java python is given, it returns combined skill object for all
  '''
  resourceArray = await getResourceLinks(skills)

  skillObjects = [getSkillObject(resource) for resource in resourceArray]
  
  print("getskills : ", "\n\n")
  for skills in skillObjects:
    print(skills, "\n\n\n\n")
  
  return merge_dictionaries(skillObjects)


async def getSkillsComparedScore (jobSkillsArray, userSkillsArray):
  userSkills = await getSkills(userSkillsArray)
  jobSkills = await getSkills(jobSkillsArray)
  score = computeScore(userSkills, jobSkills)
  return score

async def main():
  print(await getSkillsComparedScore(['c++', 'java'], ['Javacript', 'Python']))

if __name__ == '__main__':
  asyncio.run(main())


