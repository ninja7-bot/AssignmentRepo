"""
Create a DataFrame for employees:

| Name | Age | Department | Salary |
| Rahul| 25  |     HR     | 30000  |
| Priya| 30  |     IT     | 50000  |
| Amit | 28  |   Finance  | 45000  |
| Anuj | 35  |     IT     | 60000  |

Show first 2 rows
Show summary statistics
Display only IT employees
Add new column:
    Bonus = Salary * 0.10

"""

import pandas as pd

data = {
    "name": ['Rahul', 'Priya', 'Amit', 'Anuj'],
    "age": [25, 30, 28, 35],
    "dept": ["HR", "IT", "Finance", "IT"],
    "salary": [30000, 50000, 45000, 60000]
}

df = pd.DataFrame(data)
print(df)
print()

print(df.loc[[0, 1]])
print()

print(df.describe())
print()

print(df[df["dept"]=="IT"])
print()

df['bonus'] = df['salary'] * 0.10
print(df)