package collections;
import java.util.Scanner;

public class LinearSearch {
    public static int linear(int[] arr, int target){
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Enter element to search: ");
        int target = sc.nextInt();
        int res = linear(arr, target);
        
        if (res == -1){
            System.out.println("Element NOT found.");
        } else {
            System.out.println("Element found at index " + res);
        }
    }
}