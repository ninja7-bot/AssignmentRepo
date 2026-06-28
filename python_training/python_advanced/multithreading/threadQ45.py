"""
Convert a normal function into parallel execution using ProcessPoolExecutor.
"""

from concurrent.futures import ProcessPoolExecutor
import time

def square(num):
    time.sleep(1)
    return num * num

if __name__ == "__main__":
    numbers = [1, 2, 3, 4, 5]

    with ProcessPoolExecutor() as executor:
        results = executor.map(square, numbers)

    print(list(results))