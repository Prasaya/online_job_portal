import json
import csv

data = None
with open('./level_discipline_degree.json') as f:
    data = json.load(f)


datafile = open('./level_discipline_degree.csv', 'w')
csv_writer = csv.writer(datafile)

csv_writer.writerow(['qid', 'level', 'discipline', 'degree'])
index = 1
for level, disc_obj in data.items():
    csv_writer.writerow([index, level, 'ALL_DISCIPLINES', 'ALL_DEGREES'])
    index += 1
    for discipline, deg_arr in disc_obj.items():
        if discipline != 'Uncategorized':
            csv_writer.writerow([index, level, discipline, 'ALL_DEGREES'])
            index += 1
        for degree in deg_arr:
            csv_writer.writerow([index, level, discipline, degree])
            index += 1

datafile.close()

