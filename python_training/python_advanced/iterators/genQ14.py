"""
- Write a program that processes a large dataset using a generator instead of storing all values in a list.
- Show an example of a built-in generator (like range) and iterate over it.
"""

"""
Sample Employee Data and using Generator to process it.
"""
def employee_data():
    employees = [
        {"id": 1, "name": "Amit", "salary": 35000},
        {"id": 2, "name": "Priya", "salary": 42000},
        {"id": 3, "name": "Rahul", "salary": 38000},
        {"id": 4, "name": "Sneha", "salary": 45000},
        {"id": 5, "name": "Vikram", "salary": 40000},
        {"id": 6, "name": "Neha", "salary": 39000},
        {"id": 7, "name": "Arjun", "salary": 47000},
        {"id": 8, "name": "Kavya", "salary": 36000},
        {"id": 9, "name": "Rohan", "salary": 41000},
        {"id": 10, "name": "Anjali", "salary": 43000},
    ]

    for employee in employees:
        yield employee


total_salary = 0

for employee in employee_data():
    print(employee)
    total_salary += employee["salary"]

print("\nTotal Salary:", total_salary)


"""
Using Built-In Iterators to go through 0 to 9.
"""
for i in range(10):
    print(i)