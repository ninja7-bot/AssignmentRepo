"""
9. Find the largest of three numbers.
"""

"""
Largest of three numbers
"""
print("Largest of three numbers")

a, b, c = 10, 20, 15

if a >= b and a >= c:
    print(f"{a} is the largest")
elif b >= a and b >= c:
    print(f"{b} is the largest")
else:
    print(f"{c} is the largest")
    
