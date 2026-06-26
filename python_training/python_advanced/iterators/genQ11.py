"""
- Write a generator function that yields square numbers up to N.
"""

def printSquared(N):
    curr = 1
    while curr <= N:
        yield curr ** 2
        curr += 1

squares = printSquared(10)
for s in squares:
    print(s)

