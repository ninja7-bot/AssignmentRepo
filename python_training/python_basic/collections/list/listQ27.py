"""
27. Reverse a list without using reverse().
"""

lst = [1, 2, 7, 40, 53, 16, 7, 81, 19, 10]
print(f"Original list: {lst}")

"""
Reverse a list without using reverse().
"""
reversed_lst = []
for i in range(len(lst) - 1, -1, -1):
    reversed_lst.append(lst[i])
print(f"Reversed list: {reversed_lst}")