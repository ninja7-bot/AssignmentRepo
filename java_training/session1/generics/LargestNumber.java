import java.util.Scanner;

public class LargestNumber {
    public static void largest(int a, int b, int c) {
        if (a >= b && a >= c) {
            System.out.println("Largest: " + a);
        } 
        else if (b >= a && b >= c) {
            System.out.println("Largest: " + b);
        } 
        else {
            System.out.println("Largest: " + c);
        }
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Enter first number: ");
        int a = sc.nextInt();
        System.out.print("Enter second number: ");
        int b = sc.nextInt();
        System.out.print("Enter third number: ");
        int c = sc.nextInt();
        
        largest(a, b, c);
    }
}