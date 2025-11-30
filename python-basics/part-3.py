def main():
    try:
        with open("sample.csv", "r") as file:
            word_dict = {}
            for line in file:
                words = line.strip().split(",")
                for word in words:
                    if word in word_dict:
                        word_dict[word] += 1
                    else:
                        word_dict[word] = 1
            
            sorted_items_dsc = sorted(word_dict.items(), key = lambda item:item[1], reverse=True)
            print("Top 3 movies: ", sorted_items_dsc[:3])
    except FileNotFoundError:
        print("The file 'sample.csv' was not found.")

if __name__=="__main__":
    main()
