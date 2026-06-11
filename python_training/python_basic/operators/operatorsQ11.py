"""
11. Check whether a year is a leap year.
"""

"""
Leap Year Check
"""
print("Leap Year Check")

year = 2026

if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print(f"{year} is a leap year")
else:
    print(f"{year} is not a leap year")