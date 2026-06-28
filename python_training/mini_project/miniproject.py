import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

data = pd.read_csv("mini_project/students.csv")
print(data)

data['Performance'] = data['Marks'].apply(lambda x: "Pass" if x > 65 else "Fail")
print(data)

plt.plot(data["Marks"], data["Hours Studied"])
plt.title("Line Chart: Hours Studied vs Marks")
plt.show()

plt.scatter(data["Marks"], data["Hours Studied"])
plt.title("Scatter Plot: Hours Studied vs Marks")
plt.show()

sns.barplot(x="Performance", y="Marks", data=data)
plt.title("Bar Plot: Performance vs Marks")
plt.show()