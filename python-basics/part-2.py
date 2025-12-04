def validate_input(genre):
    if not genre.strip():
        return False
    return True

def main():
    genre_list = []
    genre_set = set()
    genre_dict = {}

    i = 0
    while i < 10:
        genre = input(f"Enter genre {i+1}: ")
        if not validate_input(genre):
            print("Invalid input. Please enter a non-empty genre.")
            continue
        genre_list.append(genre)
        genre_set.add(genre)
        if genre in genre_dict:
            genre_dict[genre]+=1
        else:
            genre_dict[genre]=1
        i += 1

    print("List: ", genre_list)
    print("Set: ", genre_set)
    print("Dictionary: ", genre_dict)

if __name__=="__main__":
    main()

# Feedback received:
# Add validation to ensure that the user inputs non-empty strings.
# Avoid magic numbers, have constants defined at the top.