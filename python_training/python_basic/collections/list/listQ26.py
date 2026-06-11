"""
26. Count even and odd numbers in a list.
"""

lst = [1, 2, 7, 40, 53, 16, 7, 81, 19, 10]
print(f"Original list: {lst}")

"""
Count even and odd numbers in a list.
"""
evenCount = oddCount = 0

for num in lst:
    if num % 2 == 0:
        evenCount += 1
    else:
        oddCount += 1

print(f"Even numbers: {evenCount}")
print(f"Odd numbers: {oddCount}")
print()
