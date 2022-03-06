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
    print(await skill.parse(['python', 'C++', 'writing', 'design', 'Django', 'Nodejs']))
    await skill.close()


if __name__ == '__main__':
    asyncio.run(main())

# if __name__ == '__main__':
#     app.run(debug=True)
