"""
- Create a function with a logical bug and use pdb to identify the issue.
"""

import pdb

def calculate_average(numbers):
    total = 0

    for num in numbers:
        total += num

    pdb.set_trace()

    average = total / (len(numbers) - 1) # Intended Bug
    return average

data = [10, 20, 30, 40]

print("Average:", calculate_average(data))