import mysql.connector
from dotenv import dotenv_values
import os

config = dotenv_values("../config/.env")

db = mysql.connector.connect(
    host=config["DB_HOST"],
    user=config["DB_USER"],
    password=config["DB_PASSWORD"],
    database= config["DB_NAME"],
)

cursor = db.cursor()
cursor.execute("SELECT id, email, password, type FROM auth")
for (row) in cursor:
    print(row)
