# FLASK_APP=app FLASK_ENV=development flask run

from utils.skill import getRecommendations
from flask import Flask

app = Flask(__name__)


@app.route('/jobs/<string:user>')
async def userRecommendation(user):
    recommendations = await getRecommendations(user)
    return "Hello, {}".format(user)

# async def main():
#     esco = Esco()
#     uri = (await esco.getEndpoint("Keep written records of leasing agreements."))[0]
#     uri2 = 'http://data.europa.eu/esco/skill/S2.2.1'
#     data = await esco.createSkillsRow([uri, uri2])
#     with open('skills.json', 'w') as f:
#         json.dump(data, f, indent=2)
#     await esco.close()

# if __name__ == '__main__':
#     asyncio.run(main())
