# FLASK_APP=app FLASK_ENV=development flask run

import asyncio
from Esco import Esco
from flask import Flask
from Dbpedia import DBPedia
from utils.skill import getRecommendations, getUserSkills
from quart import Quart
import json

app = Quart(__name__)
# app = Flask(__name__)


@app.route('/jobs/<string:user>')
async def userRecommendation(user):
    esco = Esco()
    userSkills = await getUserSkills(user, esco)
    await esco.close()
    return userSkills


async def main():
    dbpedia = DBPedia()
    data = await dbpedia.getSkillsComparedScore(['c++', 'java'], ['Javacript', 'Python'])
    print(data)
    # esco = Esco()
    # uri = (await esco.getEndpoint("Keep written records of leasing agreements."))[0]
    # uri2 = 'http://data.europa.eu/esco/skill/S2.2.1'
    # data = await esco.createSkillsRow([uri, uri2])
    with open('skills2.json', 'w') as f:
        json.dump(data, f, indent=2)
    # await esco.close()
    await dbpedia.close()

if __name__ == '__main__':
    asyncio.run(main())

# if __name__ == '__main__':
#     app.run(debug=True)
