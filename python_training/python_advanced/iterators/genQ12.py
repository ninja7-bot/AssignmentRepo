"""
- Write a generator to produce Fibonacci numbers.
- Write a generator expression to generate even numbers from 1 to 50.
- Explain the difference between iterator and generator with a small example.
- Write a program that processes a large dataset using a generator instead of storing all values in a list.
- Show an example of a built-in generator (like range) and iterate over it.
"""
# 0, 1, 1, 2, 3, 5, 8, 13, 21, 34

def fibbGen(N):
    temp1 = 0
    temp2 = 1
    i = 1
    while i <= N:
        if i == 1:
            yield 0
            i += 1
        elif i == 2:
            yield 1
            i += 1
        else:
            res = temp1 + temp2
            temp1 = temp2
            temp2 = res
            yield res
            i += 1
        

series = fibbGen(10)

for s in series:
    print(s)
