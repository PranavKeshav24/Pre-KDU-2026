import java.util.Scanner;

class Solution {
    public static void main(String args[]) {
        Scanner sc=new Scanner(System.in);
        String username, confirmation;

        System.out.println("Enter the username: ");
        username=sc.nextLine();

        System.out.println("Re-enter the username for confirmation: ");
        confirmation=sc.nextLine();

        int len_username=username.length();
        int len_confirmation=confirmation.length();

        System.out.println("Length 1: "+len_username);
        System.out.println("Length 2: "+len_confirmation);

        System.out.println("Lengths match: "+(len_username==len_confirmation));
        System.out.println("Strings match: "+username.equals(confirmation));
    }
}