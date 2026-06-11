"""
12. Print numbers from 1 to 100 using loop.
13. Print multiplication table of a number.
14. Find factorial of a number.
15. Reverse a number using loop.
16. Check whether a number is prime.
"""

"""
Loop to print numbers from 1 to 100
"""
for i in range(100):
    print(i)
print()


"""
Multiplication Table of 5
"""
for i in range(1, 11):
    print(f"5 * {i} = {5 * i}")
print()


"""
Factorial of a Number
"""
num = 5
fact = 1

while num > 0:
    fact *= num
    num -= 1

print(f"Factorial: {fact}")
print()


"""
Reverse a number
"""
num = 4567
revNum = 0

while num > 0:
    revNum = revNum * 10 + num % 10
    num //= 10

print(f"Reverse: {revNum}")
print()


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