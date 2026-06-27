"""
Create a package with two modules and include an __init__.py file.
"""

def fact(num):
    if num == 1:
        return 1
    return num * fact(num - 1)