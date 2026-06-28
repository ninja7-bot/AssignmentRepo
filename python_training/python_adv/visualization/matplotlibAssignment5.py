"""
Create basic charts
Using this data:
    Departments = HR, IT, Finance 
    Employees = 5, 12, 7
Tasks:
    1. Create Bar Chart
    2. Create Line Chart
    3. Create Histogram using salaries: [30000, 40000, 50000, 60000, 45000]
    4. Create Scatter Plot: Age vs Salary
"""

import matplotlib.pyplot as plt

data = {
    "dept": ["HR", "IT", "Finance"],
    "employees": [5, 12, 7]
}

salaries = [30000, 40000, 50000, 60000, 45000]
ages = [25, 30, 28, 35, 29]

plt.bar(data["dept"], data["employees"])
plt.title('Bar Chart')
plt.xlabel('Department')
plt.ylabel('Employees')
plt.show()

plt.plot(data["dept"], data["employees"])
plt.title('Line Chart')
plt.xlabel('Department')
plt.ylabel('Employees')
plt.show()

plt.hist(salaries, bins=5)
plt.title("Histogram of Salaries")
plt.xlabel("Salary")
plt.ylabel("Frequency")
plt.show()

plt.scatter(ages, salaries)
plt.title("Age vs Salary")
plt.xlabel("Age")
plt.ylabel("Salary")
plt.show()