"""
42. Implement inheritance using Person and Employee class.
"""

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def display_info(self):
        print(f"Name: {self.name}, Age: {self.age}")

class Employee(Person):
    def __init__(self, name, age, employee_id):
        super().__init__(name, age)  # Call the constructor of the parent class
        self.employee_id = employee_id

    def display_employee_info(self):
        self.display_info()  # Call the method from the parent class
        print(f"Employee ID: {self.employee_id}")

emp1 = Employee("Arisu", 30, "E123")
emp1.display_employee_info()

emp2 = Employee("Taro", 28, "E456")
emp2.display_employee_info()