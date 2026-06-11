"""
33. Count frequency of characters in a string using dictionary.
"""

string = "hello world"
charFreq = {}

for char in string:
    if char == " ":
        continue
    if char.isalnum() and char in charFreq:
        charFreq[char] += 1
    else:
        charFreq[char] = 1
print(f"Character Frequency: {charFreq}")