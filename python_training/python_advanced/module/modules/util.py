"""
Create a module with two utility functions and import it into another Python file.
"""

def isPrime(num):
    for i in range(2, num//2):
        if num%i == 0:
            return False
    return True

def fact(num):
    if num == 1:
        return 1
    return num * fact(num - 1)