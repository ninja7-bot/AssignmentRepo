import java.util.Scanner;

public class PrimeNumber {
    public static boolean isPrime(int num){
        if (num <= 1) {
            return false;
        } else {
            for (int i = 2; i < num; i++) {
                if (num % i == 0) {
                    return false;
                }
            }
        }
        return true;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Enter a number: ");
        int num = sc.nextInt();
        
        boolean res = isPrime(num);
        
        if (res) {
            System.out.println(num + " is Prime");
        } else {
            System.out.println(num + " is NOT Prime");
        }
    }
}