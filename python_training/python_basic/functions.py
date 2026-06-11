"""
Functions in Python
"""


"""
Function to calculate the square of a number
"""
def square(num):
    return num ** 2

print(f"Square of 5: {square(5)}")
print()


"""
Function to check if a string or number is a palindrome
"""
def palindrome(value):
    strValue = str(value)
    
    if strValue == strValue[::-1]:
        return True
    return False

print(f"121: {palindrome(121)}")
print(f"'level': {palindrome('level')}")
print()


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
print()


"""
Default parameter function to greet a user
"""
def greet(name="Guest"):
    return f"Hello, {name}!"

print(greet())
print(greet("Dark"))