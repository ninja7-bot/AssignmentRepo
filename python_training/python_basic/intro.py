# Introduction to Python Programs

print("Welcome to Python Training!") # Printing a Statement

"""
The Below Script will print the current version of Python being used to run this program.
"""
import sys
python_version = sys.version.split()[0]

print(f"Python version: {python_version}")

"""
Dealing with User Input and Output.
"""
name = input("Please enter your name: ") # Taking User Input
print(f"Hello, {name}! Welcome to Python programming.") # Printing a Greeting