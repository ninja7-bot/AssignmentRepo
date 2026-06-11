"""
Odd or Event
"""
print("Odd or Even Check")

num = 10

if num % 2 == 0:
    print(f"{num} is Even")
else:
    print(f"{num} is Odd")


"""
Positive, Negative or Zero
"""
print("Positive, Negative or Zero")

if num > 0:
    print(f"{num} is Positive")
elif num < 0:
    print(f"{num} is Negative")
else:
    print(f"{num} is Zero")


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
    

"""
Grade Calculation
"""
print("Grade Calculation")

marks = 85

if marks >= 80:
    print("A")
elif marks >= 60:
    print("B")
elif marks >= 40:
    print("C")
else:
    print("Fail")


"""
Leap Year Check
"""
print("Leap Year Check")

year = 2026

if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print(f"{year} is a leap year")
else:
    print(f"{year} is not a leap year")
