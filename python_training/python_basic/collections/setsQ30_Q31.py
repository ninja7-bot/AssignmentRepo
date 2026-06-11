"""
30. Perform union, intersection, and difference on two sets.
31. Remove duplicates from list using set.
"""

setA = {1, 2, 3, 4, 5}
setB = {4, 5, 6, 7, 8}

print(f"Set A: {setA}")
print(f"Set B: {setB}")
print()


"""
Operations on sets
"""
union = setA | setB
intersection = setA & setB
difference = setA - setB
symmetric_difference = setA ^ setB

print(f"Union: {union}")
print(f"Intersection: {intersection}")
print(f"Difference: {difference}")
print(f"Symmetric Difference: {symmetric_difference}")
print()


"""
Remove duplicates from a list using set
"""
lst = [1, 2, 2, 3, 4, 4, 5]
uniqueSet = set(lst)  # Convert list to set to remove duplicates
uniqueList = list(uniqueSet)  # Convert back to list
print(f"Original list: {lst}")