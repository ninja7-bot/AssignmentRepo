"""
Write a multiprocessing program to calculate the square of numbers using Process class.
"""

from multiprocessing import Process

def square(n):
    print(n ** 2)

if __name__ == "__main__":
    numbers = [2, 4, 6, 8]

    processes = []

    for num in numbers:
        p = Process(target=square, args=(num,))
        processes.append(p)
        p.start()

    for p in processes:
        p.join()