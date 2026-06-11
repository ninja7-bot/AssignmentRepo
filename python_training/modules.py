import math
import random as r
from python_basic.modules.printModule import printModule


"""
Using math module to find square root, power, and factorial.
"""
print(f"Square root of 16: {math.sqrt(16)}")
print(f"2to the power 3: {math.pow(2, 3)}")
print(f"Factorial of 5: {math.factorial(5)}")


"""
Generating random numbers using random module.
"""
print(f"Random integer between 1 and 10: {r.randint(1, 10)}")
print(f"Random float between 0 and 1: {r.random():.2f}")

"""
Creating and importing a custom module.
"""
print("Printing a message using the custom module:")
printModule("This is a message from the custom module.")