import scipy
import numpy as np
from scipy.spatial import distance
#Bachelors | Agr | Computer Science | B in Agr | B in For | BE in Comp
job =    np.array([ 1, 0, 1, 0, 0, 1]) # job needs forestry
app1 = np.array([   1, 1, 0, 1, 0, 0]) # applicant hs bachelor in agriculture
app2 = np.array([   1, 1, 0, 0, 1, 0]) # applicant has bachelor in forestry
app3 = np.array([   1, 0, 1, 0, 0, 1]) # applicant has bachelor in computer eng.

weights = [0.25, 0.5, 0.5, 1, 1, 1]
print(1-distance.cosine(job, app1,weights))
print(1-distance.cosine(job, app2,weights))
print(1-distance.cosine(job, app3,weights))
