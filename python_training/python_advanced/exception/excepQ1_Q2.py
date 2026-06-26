"""
- Write a program that takes a number as input and handles ValueError if the input is not a valid integer.
- Write a program to divide two numbers entered by the user and handle ZeroDivisionError.
"""

try:
    num = int(input("Enter a number: "))
    print(f"You entered: {num}")
except ValueError:
    print("Error: Please enter a valid integer.")

def divide_numbers():
    try:
        numerator = float(input("Enter numerator: "))
        denominator = float(input("Enter denominator: "))
        result = numerator / denominator
    except ZeroDivisionError:
        print("Error: Cannot divide by zero.")
    else:
        print(f"Result: {result}")