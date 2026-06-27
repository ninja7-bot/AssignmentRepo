"""
Create multiple threads to simulate file downloading using time.sleep().
"""

import threading
import time

def downloadFile(file):
    print(f"{file} started downloading.")
    time.sleep(2)
    print(f"{file} downloaded.")

files = ["File1", "File2", "File3"]

threads = []

for f in files:
    t = threading.Thread(target = downloadFile, args=(f,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print("Files Downloaded.")
