"""
| Name  | Age | Salary |
| Rahul | 25  | 30000  |
| Priya | NaN | 40000  |
| Anuj  | 29  |  NaN   |

Detect missing values
Replace missing Age with mean
Replace missing Salary with 0
"""
import pandas as pd

data = {
    "name": ["Rahul", "Priya", "Anuj"],
    "age": [25, None, 29],
    "salary": [30000, 40000, None]
}

df = pd.DataFrame(data)
print(df)

print("Missing Values")
print(df.isnull())

df["age"] = df["age"].fillna(df["age"].mean())
print(df)

df["salary"] = df["salary"].fillna(0)
print(df)