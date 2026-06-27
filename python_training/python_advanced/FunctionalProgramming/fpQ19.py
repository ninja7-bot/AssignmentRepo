"""
- Write a recursive function to calculate Fibonacci.
"""
# 0, 1, 1, 2, 3, 5, 8, 13, 21, 34

def fibb(num):
    if num == 0:
        return 0
    if num == 1:
        return 1
    return fibb(num - 1) + fibb(num - 2)

for i in range(10):
    print(fibb(i))


    