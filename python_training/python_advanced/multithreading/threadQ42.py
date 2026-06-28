"""
Write a program to create two processes that print their Process IDs.
"""

from multiprocessing import Process
import os

def show_pid():
    print("Process ID:", os.getpid())

if __name__ == "__main__":
    p1 = Process(target=show_pid)
    p2 = Process(target=show_pid)

    p1.start()
    p2.start()

    p1.join()
    p2.join()