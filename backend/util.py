def parse_qna(file_path):
    qna = list()
    try:
        with open(file_path, 'r') as file:
            for line in file:
                if not line.strip():
                    pass
                else:
                    qna.append(line)
        return qna
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")


def parse_recipes(file_path):
    recipes = list()
    try:
        with open(file_path) as file:
            current_line = ""
            for line in file:
                if line[0] == "\"":
                    if line[-1] == "\"":
                        current_line = line[1:-1]
                    else:
                        current_line = line[1:]
                elif line[-1] == "\"":
                    current_line += line[:-1]
                    recipes.append(current_line)
                else:
                    current_line += line
        return recipes
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")


def main():
    file_path = 'data/qna.txt'
    qna = parse_qna(file_path)
    print(qna)

    file_path = 'recipes.txt'
    recipes = parse_recipes(file_path)
    print(recipes)


if __name__ == "__main__":
    main()
