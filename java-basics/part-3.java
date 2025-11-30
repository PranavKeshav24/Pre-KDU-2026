import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

class Solution {
    public static void main(String[] args) throws java.io.FileNotFoundException {
        Scanner sc=new Scanner(new File("items.csv"));
        HashMap<String, Integer> freq=new HashMap<>();

        while (sc.hasNextLine()) {
            String line=sc.nextLine();
            String[] items=line.split(",");

            for (String item: items) {
                item=item.trim().toLowerCase();
                freq.put(item, freq.getOrDefault(item,0)+1);
            }
        }

        List<Map.Entry<String, Integer>> list=new ArrayList<>(freq.entrySet());
        Collections.sort(list, (a,b) -> b.getValue()-a.getValue());
        
        System.out.println("Top 3 items: ");
        for (int i=0; i<3 && i<list.size(); i++)
            System.out.println(list.get(i).getKey()+"="+list.get(i).getValue());
        sc.close();
    }
}
