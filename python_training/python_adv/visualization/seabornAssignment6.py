"""
Create advanced charts using employee dataset
Tasks:
    Create Barplot → Department vs Salary
    Create Boxplot → Salary distribution
    Create Heatmap using correlation between Age & Salary
"""

import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

data = pd.read_csv(f"python_adv/visualization/employee.csv")
print(data)

sns.barplot(x = "Department", y = "Salary", data=data)
plt.title("Barplot: Department vs Salary")
plt.show()

sns.boxplot(y="Salary", x="Department", data=data)
plt.title("Boxplot")
plt.show()

sns.heatmap(data[["Age", "Salary"]].corr())
plt.title("Heatmap: Age vs Salary")
plt.show()