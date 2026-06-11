"""
25. Create a list of 10 numbers and find sum, max, sort it, and remove duplicates.
26. Count even and odd numbers in a list.
27. Reverse a list without using reverse().
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


"""
Reverse a list without using reverse().
"""
reversed_lst = []
for i in range(len(lst) - 1, -1, -1):
    reversed_lst.append(lst[i])
print(f"Reversed list: {reversed_lst}")
