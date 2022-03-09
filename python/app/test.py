from utils.db import db

cursor = db.cursor()

# query = "delete FROM jobMatchScore"
# cursor.execute(query)
# db.commit()

query = "select * from jobMatchScore"
query = "select * from applicant_skills"
cursor.execute(query)
for row in cursor:
    print(row)
