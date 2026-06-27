"""
Create a package with two modules and include an __init__.py file.
"""

def isPrime(num):
    for i in range(2, num//2):
        if num%i == 0:
            return False
    return True
