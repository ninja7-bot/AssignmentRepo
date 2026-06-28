"""
Use GroupBy
Using employee dataset:
Tasks:
1. Find average salary by department
2. Find max salary by department
3. Count employees per department
"""
import pandas as pd

data = {
    "name": ["Rahul", "Priya", "Amit", "Anuj"],
    "age": [25, 30, 28, 35],
    "dept": ["HR", "IT", "Finance", "IT"],
    "salary": [30000, 50000, 45000, 60000]
}

df = pd.DataFrame(data)

print(df.groupby("dept")["salary"].mean())
print()

print(df.groupby("dept")["salary"].max())
print()

print(df.groupby("dept")["dept"].count())