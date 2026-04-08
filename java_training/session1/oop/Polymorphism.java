package oop;

class Calculator {
    int add(int a, int b) {
        return a + b;
    }
    
    int add(int a, int b, int c) {
        return a + b + c;
    }
    
    double add(double a, double b) {
        return a + b;
    }
}

class TestPolymorphism {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        
        System.out.println("add(5, 3) = " + calc.add(5, 3));
        System.out.println("add(5, 3, 2) = " + calc.add(5, 3, 2));
        System.out.println("add(5.5, 3.2) = " + calc.add(5.5, 3.2));
    }
}
