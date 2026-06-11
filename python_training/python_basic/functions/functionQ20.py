"""
20. Write a function using default parameters.
"""

"""
Default parameter function to greet a user
"""
def greet(name="Guest"):
    return f"Hello, {name}!"

print(greet())
print(greet("Dark"))