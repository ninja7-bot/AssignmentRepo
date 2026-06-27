"""
- Use pdb breakpoints inside a loop and inspect variable values.
"""

import pdb

numbers = [10, 20, 30, 40, 50]
total = 0

for num in numbers:
    pdb.set_trace()      # Breakpoint inside the loop
    total += num

print("Total:", total)