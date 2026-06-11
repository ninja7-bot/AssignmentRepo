"""
35. Create a file and write your name into it.
"""


with open("my_file.txt", "w") as f:
    f.write("Keshav Vishwakarma")

with open("my_file.txt", "r") as f:
    content = f.read()
    print(content)