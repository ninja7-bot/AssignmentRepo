import java.util.Scanner;

public class Factorial {
    public static int fact (int num) {
        int res = 1;
        for (int i = 1; i <= num; i++) {
            res = res * i;
        }
        return res;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("-----FACTORIAL PROGRAM-----\n");

        System.out.print("Enter a number: ");
        int num = sc.nextInt();
        
        int res = fact(num);
        System.out.println("Factorial of " + num + " = " + res);
    }
}