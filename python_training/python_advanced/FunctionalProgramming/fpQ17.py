"""
- Write a lambda function to find the square of a number.
- Use map() to convert a list of numbers into their squares.
- Use filter() to extract even numbers from a list.
- Use reduce() to find the product of all elements in a list.
"""
from functools import reduce

squared = lambda a: a ** 2 

print(squared(7))

numbers = [i for i in range(1, 20)]
nums_squared = list(map(lambda a: a ** 2 , numbers))
print(nums_squared)

even_nums = list(filter(lambda x: x%2 == 0, numbers))
print(even_nums)

lst = [i for i in range(1, 6)]
res = reduce(lambda x, y: x * y, lst)
print(res)