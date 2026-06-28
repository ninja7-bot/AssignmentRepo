"""
3. Create two arrays: arr_1 = [1,2,3] arr_2 = [4,5,6] 
Perform:
    ○ Addition
    ○ Multiplication
4. Create a 3×3 matrix using NumPy
"""
import numpy as np

arr_1 = np.array([1, 2, 3])
arr_2 = np.array([4, 5, 6])

add = np.add(arr_1, arr_2)
print(add)

mul = np.multiply(arr_1, arr_2)
print(mul)

mat = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(mat)