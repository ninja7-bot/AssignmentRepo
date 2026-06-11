"""
36. Read a file and count words, lines, and characters.
"""

with open("txtfile.txt", "r") as f:
    content = f.read()
    
    words = content.split()
    lines = content.splitlines()
    characters = len(content)

    print(f"Number of words: {len(words)}")
    print(f"Number of lines: {len(lines)}")
    print(f"Number of characters: {characters}")
