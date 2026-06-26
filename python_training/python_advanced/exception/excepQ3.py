"""
- Write a program using try-except-else-finally to read a number from a file  and print its square.
- Handle multiple exceptions  in a single program.
- Write a program that catches all exceptions and prints the error message.
- Create a function that raises a ValueError if a number is negative.
- Create a custom exception called AgeException and raise it if age is less than 18.
- Write a program that handles FileNotFoundError when trying to open a file.
"""

def read_num_file(file):
    try:
        with open(file, 'r') as f:
            num = int(f.read().strip())
    except FileNotFoundError:
        print(f"Error: The file '{file}' was not found.")
    else:
        print(f"Square of {num}: {num ** 2}")

file = "number.txt"
read_num_file(file)