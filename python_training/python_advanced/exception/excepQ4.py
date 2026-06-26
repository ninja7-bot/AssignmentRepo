"""
- Handle multiple exceptions  in a single program.
"""

def exception_handling():
    try:
        num = int(input("Enter a number: "))
        if num < 0:
            raise ValueError("Negative number entered.")
        print(f"You entered: {num}")
    except ValueError as ve:
        print(f"ValueError: {ve}")
    except Exception as e:
        print(f"An error occurred: {e}")

exception_handling()