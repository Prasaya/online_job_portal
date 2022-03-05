# FLASK_APP=app FLASK_ENV=development flask run

import asyncio
from Esco import Esco
from flask import Flask
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
    esco = Esco()
    uri = (await esco.getEndpoint("Keep written records of leasing agreements."))[0]
    uri2 = 'http://data.europa.eu/esco/skill/S2.2.1'
    data = await esco.createSkillsRow([uri, uri2])
    with open('skills.json', 'w') as f:
        json.dump(data, f, indent=2)
    await esco.close()

# if __name__ == '__main__':
#     print("ran")
#     asyncio.run(main())

if __name__ == '__main__':
    app.run(debug=True)