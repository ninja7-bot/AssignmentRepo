"""
- Write a generator expression to generate even numbers from 1 to 50.
"""

def evenGen():
    i = 1
    while i <= 50:
        if i % 2 == 0:
            yield i 
        i += 1
series = evenGen()
for i in series:
    print(i)