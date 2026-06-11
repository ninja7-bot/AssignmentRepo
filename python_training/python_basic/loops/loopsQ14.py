"""
14. Find factorial of a number.
"""

"""
Factorial of a Number
"""
num = 5
fact = 1

while num > 0:
    fact *= num
    num -= 1

print(f"Factorial: {fact}")