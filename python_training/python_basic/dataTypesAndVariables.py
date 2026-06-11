"""
Basic Python Concepts: Variables, Data Types, and Arithmetic Operations
"""

print("Data Types and Variables in Python")

var_int = 10
var_float = 3.14
var_string = "Sample String!"
var_boolean = True

print(f"{var_int}: {type(var_int)}")
print(f"{var_float}: {type(var_float)}")
print(f"{var_string}: {type(var_string)}")
print(f"{var_boolean}: {type(var_boolean)}")

print()

"""
Swapping two numbers
"""

print("Swapping two numbers")

a = 5
b = 10
print(f"Before swapping: a = {a}, b = {b}")
a, b = b, a
print(f"After swapping: a = {a}, b = {b}")

print()

"""
Performing basic arithmetic operations
"""

print("Performing basic arithmetic operations")

num1 = 15
num2 = 5

sum_result = num1 + num2
difference_result = num1 - num2
product_result = num1 * num2
division_result = num1 / num2

print(f"Sum: {sum_result}")
print(f"Difference: {difference_result}")
print(f"Product: {product_result}")
print(f"Division: {division_result}")