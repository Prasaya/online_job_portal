# FLASK_APP=app FLASK_ENV=development flask run

import asyncio
from SkillParser import SkillParser
from quart import Quart
import json

app = Quart(__name__)


@app.route('/jobs/<string:user>')
async def userRecommendation(user):
    return '<p>Hello world!</p>'


async def main():
    skill = SkillParser()
    skills = [
        'Python',
        'C++',
        'Django',
        'Nodejs',
        'Java',
        'JavaScript',
        'C#',
        'PHP',
        'Ruby',
        'Go',
        'Swift',
        "Coordinate and responsible for the company's HR work",
        "Responsible for Nepalese's labour policy implementation and HR outreach work",
        "Responsible for the formulation of Nepalese's local HR policy, and the promotion and implementation of important work tasks",
        "Responsible for Nepalese's staff recruitment & allocation, compensation & benefits, and performance management",
        "Responsible for Nepalese staffs' remuneration calculation and salary data statistics",
        "Responsible for post & designation management, post & designation adjustment, post & designation transfer, etc.",
        "Responsible for Nepalese's staff training, and cultural integration policy formulation",
        "Responsible for HR team building and individual training",
        "Responsible for department internal audit",
        "Responsible for the preparation of company's manpower cost budget",
    ]
    endpoints = [
        ('http://dbpedia.org/resource/Python_(programming_language)',
         'ProgrammingLanguage'),
        ('http://dbpedia.org/resource/C++', 'ProgrammingLanguage'),
        ('http://dbpedia.org/resource/Django_(web_framework)', 'Software'),
        ('http://dbpedia.org/resource/Node.js', 'Software'),
        ('http://dbpedia.org/resource/Java_(programming_language)', 'ProgrammingLanguage'),
        ('http://dbpedia.org/resource/JavaScript', 'ProgrammingLanguage'),
        ('http://dbpedia.org/resource/C++', 'ProgrammingLanguage'),
        ('http://dbpedia.org/resource/PHP', 'ProgrammingLanguage'),
        ('http://dbpedia.org/resource/Pokémon_Ruby_and_Sapphire', 'Software'),
        ('http://dbpedia.org/resource/Go_(programming_language)', 'ProgrammingLanguage'),
        (['http://data.europa.eu/esco/skill/be80acfc-b6f2-4411-9b8d-b19d9cd2556a'], None),
        (['http://data.europa.eu/esco/skill/339ac029-066a-4985-9f9d-b3d7c8fea0bb'], None),
        (['http://data.europa.eu/esco/occupation/a1ba7574-cc28-446c-9741-12d7fbb325cb'], None),
        (['http://data.europa.eu/esco/isco/C111'], None),
        (['http://data.europa.eu/esco/skill/9601b2a8-68e4-4906-9306-a23679b8f0b0'], None),
        (['http://data.europa.eu/esco/skill/6789defa-dc57-42a8-b2ed-2b8c349aa3e2'], None),
        (['http://data.europa.eu/esco/skill/9cdec88a-fe17-4f9a-9247-1f1802ab7408'], None),
        (['http://data.europa.eu/esco/skill/e5f77488-7561-475a-9888-decd2443d37a'], None),
        (['http://data.europa.eu/esco/skill/045df803-cbab-40a9-9ac0-3c4a81ab4b2c'], None),
        (['http://data.europa.eu/esco/skill/8804d963-5a31-4609-b5df-f741b7199fb7'], None),
        (['http://data.europa.eu/esco/occupation/4e4a291d-1d38-4c5a-812a-5827d0691b11'], None)
    ]
    fromParse = {}
    fromEndpoints = {}
    # endpoints = await skill.getEndpoints(skills)
    fromEndpoints = await skill._parseFromURI(endpoints)
    # fromParse = await skill.parse(skills)
    # for key, value in fromEndpoints.items():
    #     if key not in fromParse or fromParse[key] != value:
    #         print('keyMissing in parse:', key)
    # for key, value in fromParse.items():
    #     if key not in fromEndpoints or fromEndpoints[key] != value:
    #         print('keyMissing in endpoint:', key)
    with open('tests.json', 'w') as f:
        json.dump({'e': fromEndpoints, 'p': fromParse}, f, indent=4)
    await skill.close()


if __name__ == '__main__':
    asyncio.run(main())

# if __name__ == '__main__':
#     app.run(debug=True)
