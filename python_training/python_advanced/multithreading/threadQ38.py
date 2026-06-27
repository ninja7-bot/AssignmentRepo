"""
- Write a program to create two threads that print numbers from 1 to 5 simultaneously.
"""

import threading
import time

def print_numbers(thread_name):
    for i in range(1, 6):
        print(f"{thread_name}: {i}")
        time.sleep(0.5)

thread1 = threading.Thread(target=print_numbers, args=("Thread 1",))
thread2 = threading.Thread(target=print_numbers, args=("Thread 2",))

thread1.start()
thread2.start()

print("Both threads have finished.")