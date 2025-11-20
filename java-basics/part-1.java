import java.util.Scanner;

class Solution {
    public static void main(String args[]) {
        Scanner sc=new Scanner(System.in);
        String username, confirmation;

        System.out.println("Enter the username: ");
        username=sc.nextLine();

        System.out.println("Re-enter the username for confirmation: ");
        confirmation=sc.nextLine();

        int lenUsername=username.length();
        int lenConfirmation=confirmation.length();

        System.out.println("Length 1: "+lenUsername);
        System.out.println("Length 2: "+lenConfirmation);

        System.out.println("Lengths match: "+(lenUsername==lenConfirmation));
        System.out.println("Strings match: "+username.equals(confirmation));
        sc.close();
    }
}