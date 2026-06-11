"""
37. Append data to existing file.
"""

with open("txtfile.txt", "a") as f:
    f.write("\nThis is an appended line.")

with open("txtfile.txt", "r") as f:
    content = f.read()
    print(content)