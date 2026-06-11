"""
38. Copy content from one file to another.
"""

with open("txtfile.txt", "r") as source_file, open("copyfile.txt", "w") as dest_file:
    content = source_file.read()
    dest_file.write(content)

    print("Content copied successfully from txtfile.txt to copyfile.txt")

with open("copyfile.txt", "r") as f:
    copied_content = f.read()
    print("Content of copyfile.txt:")
    print(copied_content)