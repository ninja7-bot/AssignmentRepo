"""
39. Search a word in a file.
"""

with open("txtfile.txt", "r") as f:
    content = f.read()
    target = "Lorem"

    if target in content:
        print(f"The word '{target}' was found in the file.")
    else:
        print(f"The word '{target}' was not found in the file.")