import mysql.connector
from dotenv import dotenv_values
import os

config = dotenv_values("./config/.env")

db = mysql.connector.connect(
    host=config["DB_HOST"],
    user=config["DB_USER"],
    password=config["DB_PASSWORD"],
    database=config["DB_NAME"],
)


async def getDBSkills(uid):
    cursor = db.cursor()
    cursor.execute("""
        SELECT name, proficiency, experience from applicant_skills WHERE id = %s
    """, (uid,))
    return cursor
