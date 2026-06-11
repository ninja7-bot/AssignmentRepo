"""
43. Implement encapsulation using private variables in Bank class.
"""

class Bank:
    def __init__(self, account_holder, balance):
        self.account_holder = account_holder
        self.__balance = balance  # Private variable

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print(f"Deposited {amount}. New balance: {self.__balance}")
        else:
            print("Deposit amount must be positive.")

    def withdraw(self, amount):
        if amount > 0 and amount <= self.__balance:
            self.__balance -= amount
            print(f"Withdrew {amount}. New balance: {self.__balance}")
        else:
            print("Invalid withdrawal amount or insufficient funds.")

    def get_balance(self):
        return self.__balance
    
acc1 = Bank("Alice", 1000)
acc1.deposit(500)
acc1.withdraw(200)
print(f"Current Balance: {acc1.get_balance()}")

acc2 = Bank("Bob", 1500)
acc2.deposit(300)
acc2.withdraw(100)
print(f"Current Balance: {acc2.get_balance()}")