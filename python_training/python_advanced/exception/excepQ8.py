"""
- Write a program that handles FileNotFoundError when trying to open a file.
"""

try:
    with open("file.txt", "r") as f:
        content = f.read()
except FileNotFoundError:
    print("Error: File not found.")