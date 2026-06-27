"""
Demonstrate the use of join() method in threading.
"""

import threading
import time

def task():
    print("Task started")
    time.sleep(3)
    print("Task completed")

t = threading.Thread(target=task)

t.start()

t.join()

print("Main program ends")