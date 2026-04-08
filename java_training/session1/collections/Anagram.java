package collections;

import java.util.Arrays;
import java.util.Scanner;

public class Anagram {
    public static boolean checkAnagram (String str1, String str2){
        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();
        
        if (str1.length() != str2.length()) {
            return false;
        } else {
            char[] arr1 = str1.toCharArray();
            char[] arr2 = str2.toCharArray();
            
            Arrays.sort(arr1);
            Arrays.sort(arr2);
            
            if (Arrays.equals(arr1, arr2)) {
                return true;
            }
        }
        return false;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Enter first string: ");
        String str1 = sc.nextLine();
        
        System.out.print("Enter second string: ");
        String str2 = sc.nextLine();
        
        if (checkAnagram(str1, str2)) {
            System.out.println("Anagram");
        } else {
            System.out.println("NOT Anagram");
        }
    }
}
