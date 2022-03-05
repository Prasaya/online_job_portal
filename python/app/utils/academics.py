import asyncio
from db import db
from scipy.spatial import distance

cached = None
isUpdating = False


async def academicData():
    """
    Creates row array of all academic qualifications
    Return value contains qid as key and list of qids associated as values
    For qid of 1; ("Masters", "ALL_DISCIPLINES", "ALL_DEGREES") result[1] contains
    list of all qids associated with Masters
    The result is cached in global variable cached
    """
    global isUpdating
    global cached
    # if something is updating do nothing; don't know if it is thread safe
    while isUpdating:
        asyncio.sleep(1)
    isUpdating = True
    if cached is not None:
        return cached
    # Store final result
    # {qid: [qids]}
    temp = {}
    # Store list of qid whose discipline is ALL_DISCIPLINES ordered by level
    # {level: qid}
    allDisciplineQid = {}
    # Store list of qid whose degree is ALL_DEGREES ordered by discipline, level
    # {discipline: {level: qid}}
    allDegreeQid = {}
    # {level: {discipline: [qid, qid, ...]}}
    qidByLevelDiscipline = {}
    cursor = db.cursor()
    cursor.execute("""
      SELECT qid, level, discipline, degree from academic_qualifications
    """)
    for qid, level, discipline, degree in cursor:

        temp[qid] = set()
        temp[qid].add(qid)
        if discipline == 'ALL_DISCIPLINES':
            allDisciplineQid[level] = qid
        elif degree == 'ALL_DEGREES':
            if discipline not in allDegreeQid:
                allDegreeQid[discipline] = {}
            allDegreeQid[discipline][level] = qid
        if level not in qidByLevelDiscipline:
            qidByLevelDiscipline[level] = {}
        if discipline not in qidByLevelDiscipline[level]:
            qidByLevelDiscipline[level][discipline] = set()
        qidByLevelDiscipline[level][discipline].add(qid)
    # For each qid with discipline ALL_DISCIPLINES add all qids with same level
    for level, qid in allDisciplineQid.items():
        temp[qid] = temp[qid].union(
            set([j for i in qidByLevelDiscipline[level].values() for j in i])
        )
    # For each qid with degree ALL_DEGREES add all qids with same discipline and level
    for discipline, levelQid in allDegreeQid.items():
        for level, qid in levelQid.items():
            temp[qid] = temp[qid].union(
                qidByLevelDiscipline[level][discipline])
    cached = temp
    return cached


async def getUserAcademics(uid):
    rowData = await academicData()
    finalData = [0 for i in range(len(rowData) + 1)]
    cursor = db.cursor()
    cursor.execute("""
      SELECT qid FROM applicant_academics WHERE id = %s
    """, (uid,))
    for (qid,) in cursor:
        for toUpdate in rowData[qid]:
            finalData[toUpdate] = 1
    return finalData


async def getJobAcademics(jid):
    rowData = await academicData()
    finalData = [0 for i in range(len(rowData) + 1)]
    cursor = db.cursor()
    cursor.execute("""
      SELECT qid FROM job_qualifications WHERE jobId = %s
    """, (jid,))
    for (qid,) in cursor:
        for toUpdate in rowData[qid]:
            finalData[toUpdate] = 1
    return finalData


async def determineAcademicCompatibility(user, job):
    userAcademics = await getUserAcademics(user)
    jobAcademics = await getJobAcademics(job)
    return distance.cosine(userAcademics, jobAcademics)
