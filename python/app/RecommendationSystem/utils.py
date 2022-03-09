from scipy.spatial import distance


async def computeScore(userSkills, jobSkills):
    userRow = []
    jobRow = []
    allzero = True
    for key, value in jobSkills.items():
        jobRow.append(value)
        if key in userSkills:
            userRow.append(userSkills[key])
            allzero = False
        else:
            userRow.append(0)
    if not allzero:
        return 1 - distance.cosine(userRow, jobRow)
    else:
        return 0
