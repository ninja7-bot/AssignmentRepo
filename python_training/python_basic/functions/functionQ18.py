"""
18. Write a function to check palindrome(Number and string).
"""

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