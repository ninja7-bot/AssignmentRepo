"""
28. Create a tuple and access elements.
29. Convert tuple into list and modify it.
"""

"""
Tuples in Python
"""
data = (1, 2, 3, "Hello", True)
print(f"Tuple: {data} {type(data)}")

for item in data:
    print(item)
print()


"""
Modifying a Tuple
"""
dataList = list(data)  # Convert tuple to list
dataList.append("World")  # Modify the list
data = tuple(dataList)  # Convert back to tuple
print(f"Modified Tuple: {data}")
