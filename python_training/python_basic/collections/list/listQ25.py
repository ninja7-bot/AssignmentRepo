"""
25. Create a list of 10 numbers and find sum, max, sort it, and remove duplicates.
"""

lst = [1, 2, 7, 40, 53, 16, 7, 81, 19, 10]
print(f"Original list: {lst}")

"""
Sum, Max, Sort, and Remove Duplicates from a list.
"""
# Sum of a list
temp = 0
for i in lst:
    temp += i
print(f"Sum: {temp}")

# Maximum number in a list
maxNum = lst[0]
for num in lst:
    if num > maxNum:
        maxNum = num
print(f"Max: {maxNum}")

# Bubble Sort
for i in range(len(lst)):
    for j in range(i + 1, len(lst)):
        if lst[i] > lst[j]:
            lst[i], lst[j] = lst[j], lst[i]
print(f"Sorted: {lst}")

# Remove duplicates
uniqueLst = []
for x in lst:
    if x not in uniqueLst:
        uniqueLst.append(x)
print(f"Without duplicates: {uniqueLst}")
print()
