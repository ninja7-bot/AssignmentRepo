import java.util.Scanner;

public class Fibonacci {
    public static void fibb (int lim){
        int a = 0, b = 1;
        System.out.print("Fibonacci sequence: " + a + " " + b + " ");
        
        while (true) {
            int c = a + b;
            if (c > lim) {
                break;
            }
            System.out.print(c + " ");
            a = b;
            b = c;
        }
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("-----FIBONACCI SERIES-----\n");
        
        System.out.print("Enter limit: ");
        int limit = sc.nextInt();
        
        fibb(limit);
    }
}
