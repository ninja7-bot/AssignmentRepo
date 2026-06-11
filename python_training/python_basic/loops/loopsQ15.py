"""
15. Reverse a number using loop.
"""

"""
Reverse a number
"""
num = 4567
revNum = 0

while num > 0:
    revNum = revNum * 10 + num % 10
    num //= 10

print(f"Reverse: {revNum}")