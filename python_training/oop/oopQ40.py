"""
40. Create a Student class with attributes and display details.
"""

class Student:
    def __init__(self, name, age, grade):
        self.name = name
        self.age = age
        self.grade = grade

    def display_details(self):
        print(f"Name: {self.name}, Age: {self.age}, Grade: {self.grade}")

s1 = Student("Rahul", 15, "10th")
s1.display_details()

s2 = Student("Priya", 14, "9th")
s2.display_details()

