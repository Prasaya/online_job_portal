import scipy
import numpy as np
from scipy.spatial import distance

array1 = np.array([1, 2, 3, 4, 5])
array2 = np.array([1, 2, 3, 4, 6])

print(distance.cosine(array1, array2))