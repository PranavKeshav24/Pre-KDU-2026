def main():
    with open("sample.csv", "r") as file:
        lines=file.readlines()
        word_list=[]
        for line in lines:
            words=line.strip().split(",")
            word_list.extend(words)
        word_dict={}
        for word in word_list:
            if word in word_dict:
                word_dict[word]+=1
            else:
                word_dict[word]=1
        
        sorted_items_dsc=sorted(word_dict.items(), key=lambda item:item[1], reverse=True)
        print("Top 3 movies: ", sorted_items_dsc[:3])

if __name__=="__main__":
    main()