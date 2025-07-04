from datetime import datetime

class File:
    def __init__(self, name, content=""):
        self.name = name
        self.content = content
        self.size = len(content)
        self.created_at = datetime.now()

class Directory:
    def __init__(self, name):
        self.name = name
        self.files = {}  # Dictionary to store files
        self.directories = {}  # Dictionary to store subdirectories

class FileSystem:
    def __init__(self):
        self.root = Directory("root")
        self.current_directory = self.root

    def create_file(self, filename, content=""):
        """Create a new file in the current directory"""
        if filename in self.current_directory.files:
            return "File already exists!"
        self.current_directory.files[filename] = File(filename, content)
        return f"File '{filename}' created successfully"

    def read_file(self, filename):
        """Read content of a file"""
        if filename not in self.current_directory.files:
            return "File not found!"
        return self.current_directory.files[filename].content

    def write_file(self, filename, content):
        """Write content to a file"""
        if filename not in self.current_directory.files:
            return "File not found!"
        self.current_directory.files[filename].content = content
        self.current_directory.files[filename].size = len(content)
        return f"Content written to '{filename}' successfully"

    def delete_file(self, filename):
        """Delete a file"""
        if filename not in self.current_directory.files:
            return "File not found!"
        del self.current_directory.files[filename]
        return f"File '{filename}' deleted successfully"

    def create_directory(self, dirname):
        """Create a new directory"""
        if dirname in self.current_directory.directories:
            return "Directory already exists!"
        self.current_directory.directories[dirname] = Directory(dirname)
        return f"Directory '{dirname}' created successfully"

    def list_contents(self):
        """List all files and directories in current directory"""
        contents = []
        contents.append("Directories:")
        for dirname in self.current_directory.directories:
            contents.append(f"  - {dirname}/")
        contents.append("\nFiles:")
        for filename in self.current_directory.files:
            file = self.current_directory.files[filename]
            contents.append(f"  - {filename} (size: {file.size} bytes)")
        return "\n".join(contents)