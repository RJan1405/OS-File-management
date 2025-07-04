from file_system import FileSystem
from datetime import datetime
import os
import shutil
import time

def clear_screen():
    os.system('cls')

def display_header():
    clear_screen()
    print("╔══════════════════════════════════════════════════════════╗")
    print("║                  File Management System                   ║")
    print("║                                                          ║")
    print(f"║  Current Path: {os.getcwd():<41}║")
    print("╚══════════════════════════════════════════════════════════╝")

def display_menu():
    print("\n┌──────────────── Available Operations ────────────────┐")
    print("│                                                      │")
    print("│  [1] 📝 Create File        [7]  📋 Copy File        │")
    print("│  [2] 📖 Read File          [8]  ✂️  Move File        │")
    print("│  [3] ✏️  Write to File      [9]  ℹ️  File Properties  │")
    print("│  [4] 🗑️  Delete File        [10] 📂 Change Directory │")
    print("│  [5] 📁 Create Directory    [11] ⬆️  Parent Directory │")
    print("│  [6] 📋 List Contents      [12] 🚪 Exit             │")
    print("│                                                      │")
    print("└──────────────────────────────────────────────────────┘")

def get_file_properties(filename):
    try:
        stats = os.stat(filename)
        created = time.ctime(stats.st_ctime)
        modified = time.ctime(stats.st_mtime)
        size = stats.st_size
        return f"""
┌──────────── File Properties ────────────┐
│ File: {filename:<34} │
├─────────────────────────────────────────┤
│ Size: {size} bytes
│ Created: {created}
│ Last Modified: {modified}
└─────────────────────────────────────────┘
"""
    except FileNotFoundError:
        return "⚠️  File not found!"

def list_directory_contents():
    print("\n┌──────────── Directory Contents ────────────┐")
    print("│ Name                     Size     Type     │")
    print("├─────────────────────────────────────────────┤")
    for item in os.listdir():
        if os.path.isfile(item):
            size = os.path.getsize(item)
            ext = os.path.splitext(item)[1] or 'FILE'
            print(f"│ {item:<20} {size:>8} bytes  {ext:<7} │")
        else:
            print(f"│ {item:<20} {'<DIR>':>8}          │")
    print("└─────────────────────────────────────────────┘")

# Update the main function's option 6 to use the new list_directory_contents
def main():
    fs = FileSystem()
    
    while True:
        display_header()
        display_menu()
        
        try:
            choice = input("\nEnter your choice (1-12): ")
            
            if choice == '1':
                filename = input("Enter filename: ")
                content = input("Enter content: ")
                with open(filename, 'w') as f:
                    f.write(content)
                print(f"\nFile '{filename}' created successfully!")
            
            elif choice == '2':
                filename = input("Enter filename: ")
                try:
                    with open(filename, 'r') as f:
                        print(f"\nContent of {filename}:")
                        print("------------------------")
                        print(f.read())
                except FileNotFoundError:
                    print("File not found!")
            
            elif choice == '3':
                filename = input("Enter filename: ")
                content = input("Enter new content: ")
                try:
                    with open(filename, 'w') as f:
                        f.write(content)
                    print(f"\nContent written to '{filename}' successfully!")
                except FileNotFoundError:
                    print("File not found!")
            
            elif choice == '4':
                filename = input("Enter filename: ")
                try:
                    os.remove(filename)
                    print(f"\nFile '{filename}' deleted successfully!")
                except FileNotFoundError:
                    print("File not found!")
            
            elif choice == '5':
                dirname = input("Enter directory name: ")
                try:
                    os.makedirs(dirname)
                    print(f"\nDirectory '{dirname}' created successfully!")
                except FileExistsError:
                    print("Directory already exists!")
            
            elif choice == '6':
                list_directory_contents()
            
            elif choice == '7':
                source = input("Enter source filename: ")
                dest = input("Enter destination filename: ")
                try:
                    shutil.copy2(source, dest)
                    print(f"\nFile copied successfully!")
                except FileNotFoundError:
                    print("Source file not found!")
            
            elif choice == '8':
                source = input("Enter source filename: ")
                dest = input("Enter destination filename: ")
                try:
                    shutil.move(source, dest)
                    print(f"\nFile moved successfully!")
                except FileNotFoundError:
                    print("Source file not found!")
            
            elif choice == '9':
                filename = input("Enter filename: ")
                print(get_file_properties(filename))
            
            elif choice == '10':
                dirname = input("Enter directory name: ")
                try:
                    os.chdir(dirname)
                    print(f"\nChanged to directory: {os.getcwd()}")
                except FileNotFoundError:
                    print("Directory not found!")
                except PermissionError:
                    print("Permission denied!")
            
            elif choice == '11':
                try:
                    os.chdir('..')
                    print(f"\nMoved to parent directory: {os.getcwd()}")
                except PermissionError:
                    print("Permission denied!")
                except OSError:
                    print("Already at root directory!")
            
            elif choice == '12':
                print("\nThank you for using the File Management System!")
                break
            
            else:
                print("Invalid choice! Please try again.")
            
            input("\nPress Enter to continue...")
            
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()