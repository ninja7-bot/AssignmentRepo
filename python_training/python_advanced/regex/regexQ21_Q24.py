"""
- Write a program to extract all numbers from a given string using regular expressions.
- Write a regular expression to validate an email address.
- Write a regular expression to validate a 10-digit mobile number.
- Use re.search() to check whether a word exists in a sentence.
- Use re.findall() to extract all words starting with a capital letter.
"""
import re

string = "During the 2025 community survey, 147 volunteers recorded observations across 18 neighborhoods over 42 days. The team collected 3,684 photos, identified 912 unique plant species, and logged 76 maintenance requests. On day 11, heavy rain delayed fieldwork by 2 hours, but the schedule recovered by week 7. Each participant completed an average of 5 sessions, and the final report totaled 128 pages with 24 charts and 9 appendices. The project concluded with a satisfaction score of 94.6%, exceeding the original target of 90%."
res = re.findall("[0-9]", string)
print(res)

emails = [
    "john.doe@example.com",
    "alice_123@gmail.com",
    "user+work@company.co.in",
    "first.last@sub.domain.org",
    "test@localhost",
    "@gmail.com",
    "username@.com",
    "john..doe@gmail.com",
    "user@gmail",
    "user#example.com"
]
for mail in emails:
    if re.search("@gmail.com$", mail):
        print(f"{mail}: Valid")
    else:
        print(f"{mail}: Invalid")

contacts = [
    "9876543210",
    "9123456789",
    "7012345678",
    "8899001122",
    "9988776655",
    "1234567890",
    "5678901234",
    "987654321",
    "98765432101",
    "98A6543210",
]

for c in contacts:
    if re.search("^[6-9]\d{9}$", c):
        print(f"{c}: Valid")
    else:
        print(f"{c}: Invalid")

response = re.search("species", string)
print(response)