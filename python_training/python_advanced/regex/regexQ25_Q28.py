"""
- Replace multiple spaces in a string with a single space using re.sub().
- Write a pattern to check if a string contains only alphabets.
- Create a password validation program using regex (minimum length, one digit, one special character).
"""

import re

sample = "The project 482 started on  Monday  with 17 participants, but only 15 completed the  initial setup after encountering  3 minor configuration  issues."


lst = re.findall(r"\b[A-Z][a-z]*", sample)
print(lst)

res = re.sub("\\s+", " ", sample)
print(res)

strSample = ""

if re.findall(r"\D", sample) is None:
    print("Only Alphabets.")
else:
    print("Alphanumeric")

def passwordValidate(password):
    if re.search(r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", password):
        return True
    return False
print(passwordValidate("sdfghjksdfg1@Hj"))