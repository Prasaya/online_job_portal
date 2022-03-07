from scipy.spatial import distance


def mergeDictionaries(dictionaries, selection=max):
    output = {}
    for dictionary in dictionaries:
        for key, value in dictionary.items():
            if key in output:
                output[key] = selection(output[key], value)
            else:
                output[key] = value
    return output


async def computeScore(userSkills, jobSkills):
    userRow = []
    jobRow = []
    for key, value in jobSkills.items():
        jobRow.append(value)
        if(key in userSkills):
            userRow.append(userSkills[key])
        else:
            userRow.append(0)
    return 1 - distance.cosine(userRow, jobRow)
