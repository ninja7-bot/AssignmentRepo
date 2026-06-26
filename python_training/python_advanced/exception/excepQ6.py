"""
- Create a function that raises a ValueError if a number is negative.
- Create a custom exception called AgeException and raise it if age is less than 18.
- Write a program that handles FileNotFoundError when trying to open a file.
"""

try:
    num = int(input("Enter a number: "))
    if num < 0:
        raise ValueError("Negative number entered.")
    print(f"You entered: {num}")
except ValueError as ve:
    print(f"ValueError: {ve}")
except Exception as e:
    print(f"An error occurred: {e}")