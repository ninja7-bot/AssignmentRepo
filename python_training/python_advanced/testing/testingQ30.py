"""
- Write pytest test cases for a function that checks whether a number is prime.
"""

def isPrime(num):
    for i in range(2, num//2+1):
        if num % i == 0:
            return False
    return True

def testPrime1():
    assert isPrime(7) == True

def testPrime2():
    assert isPrime(4) != True

def testPrime3():
    assert isPrime(3) == True

def testPrime4():
    assert isPrime(9) == False

def testPrime5():
    assert isPrime(10) == False

def testPrime6():
    assert isPrime(19) == True
