import java.util.Scanner;

public class ArrayAverage {
    public static double findAverage(int[] arr, int n) {
        double sum = 0;

        for (int i = 0; i < n; i++) {
            sum = sum + arr[i];
        }

        return sum / n;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter size of array: ");
        int n = sc.nextInt();

        int[] arr = new int[n];

        System.out.println("Enter elements:");
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }

        double avg = findAverage(arr, n);

        System.out.println("Average: " + avg);

        sc.close();
    }
}