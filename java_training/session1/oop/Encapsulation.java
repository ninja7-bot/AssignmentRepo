package oop;

class BankAccount {
    private double balance;
    
    BankAccount(double initial) {
        balance = initial;
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance = balance + amount;
            System.out.println("Deposited: " + amount);
        }
    }
    
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance = balance - amount;
            System.out.println("Withdrawn: " + amount);
        } else {
            System.out.println("Insufficient balance");
        }
    }
    
    public double getBalance() {
        return balance;
    }
}

class TestEncapsulation {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount(1000);
        acc.deposit(500);
        acc.withdraw(200);
        System.out.println("Balance: " + acc.getBalance());
    }
}
