"""
- Create a custom exception called AgeException and raise it if age is less than 18.
"""

try:
    age = int(input("Enter your age: "))
    if age < 18:
        raise AgeException("Age must be at least 18.")
    print(f"Your age is: {age}")
except AgeException as ae:
    print(f"AgeException: {ae}")