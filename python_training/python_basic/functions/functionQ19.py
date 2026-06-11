"""
19. Write a function that returns maximum number from a list.
"""


"""
Function to find the maximum number in a list
"""
def maxInList(lst):
    if not lst:
        return None
    
    maxNum = lst[0]

    for num in lst:
        if num > maxNum:
            maxNum = num
    return maxNum

print(f"Max in [3, 1, 4, 1, 5]: {maxInList([3, 1, 4, 1, 5])}")