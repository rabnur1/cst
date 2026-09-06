Python 3.14.7 (tags/v3.14.7:823f032, Aug  5 2026, 10:51:32) [MSC v.1944 64 bit (AMD64)] on win32
Enter "help" below or click "Help" above for more information.
def load_tasks():
    try:
        with open("tasks.txt", "r") as f:
            return [line.strip() for line in f.readlines()]
    except FileNotFoundError:
        return []


def save_tasks(tasks):
    with open("tasks.txt", "w") as f:
        for task in tasks:
            f.write(task + "\n")


def show_tasks(tasks):
    print("\n🌸 Your Cute To-Do List 🌸")
    if not tasks:
        print("No tasks yet! Add something sweet 💖")
    else:
        for i, task in enumerate(tasks, 1):
            print(f"{i}. {task}")


def main():
    tasks = load_tasks()

    while True:
        print("\n--- Menu ---")
        print("1. Show tasks")
        print("2. Add task")
        print("3. Delete task")
        print("4. Exit")

        choice = input("Choose: ")

        if choice == "1":
            show_tasks(tasks)

        elif choice == "2":
            task = input("Enter task: ")
            tasks.append(task)
            save_tasks(tasks)

        elif choice == "3":
            show_tasks(tasks)
            try:
                num = int(input("Enter task number to delete: "))
                tasks.pop(num - 1)
                save_tasks(tasks)
            except (ValueError, IndexError):
                print("Invalid choice!")

        elif choice == "4":
            break

        else:
            print("Invalid option!")


if __name__ == "__main__":
    main()
    
SyntaxError: invalid syntax
