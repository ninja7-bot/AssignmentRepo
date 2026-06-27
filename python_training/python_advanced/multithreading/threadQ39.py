"""
Create a thread that calculates the sum of numbers from 1 to 100.
"""

import threading

def calculate_sum():
    total = sum(range(1, 101))
    print("Sum =", total)

t = threading.Thread(target=calculate_sum)

t.start()
t.join()