def main():
    genre_list = []
    genre_set = set()
    genre_dict = {}

    for i in range(10):
        genre = input(f"Enter genre {i+1}: ")
        genre_list.append(genre)
        genre_set.add(genre)
        if genre in genre_dict:
            genre_dict[genre]+=1
        else:
            genre_dict[genre]=1

    print("List: ", genre_list)
    print("Set: ", genre_set)
    print("Dictionary: ", genre_dict)

if __name__=="__main__":
    main()
    