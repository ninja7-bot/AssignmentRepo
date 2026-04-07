import java.util.Scanner;

public class EvenOdd {

    public static String oddEven(int num) {
        if (num % 2 == 0) {
            return "Even";
        } else {
            return "Odd";
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("-----ODD OR EVEN-----\n");

        System.out.print("Enter a number: ");
        int num = sc.nextInt();

        String result = oddEven(num);

        System.out.println("The number " + num + " is " + result);
    }
}