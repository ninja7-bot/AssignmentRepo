"""
32. Create a student dictionary and access values.
33. Count frequency of characters in a string using dictionary.
34. Merge two dictionaries.
"""

# Sample Dictionary of students
students = {
    "s1": {"name": "Rahul", "standard": 10, "age": 15},
    "s2": {"name": "Priya", "standard": 9, "age": 14},
    "s3": {"name": "Amit", "standard": 10, "age": 15},
    "s4": {"name": "Sneha", "standard": 8, "age": 13},
    "s5": {"name": "Rohit", "standard": 9, "age": 14}
}

print("Student Dictionary:")
for student in students:
    print(f"Name: {students[student]['name']}, Standard: {students[student]['standard']}, Age: {students[student]['age']}")

print()




