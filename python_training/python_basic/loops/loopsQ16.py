"""
16. Check whether a number is prime.
"""

"""
Check if a number is prime
"""
num = 17
isPrime = True

for i in range(2, int(num ** 0.5) + 1):
    if num % i == 0:
        isPrime = False
        break

if isPrime:
    print(f"{num} is a prime number")
else:
    print(f"{num} is not a prime number")