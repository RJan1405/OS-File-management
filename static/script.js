// Remove all duplicate function declarations and keep only one version of each
// Keep these variables at the top
let currentEditingFile = '';
let currentRenamingFile = '';

function refreshFiles() {
    fetch('/list_files')
        .then(response => response.json())
        .then(data => {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
            document.getElementById('currentPath').textContent = data.current_path;
            
            data.files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                
                const icon = file.type === 'file' ? 'fa-file' : 'fa-folder';
                const clickHandler = file.type === 'file' ? 
                    `onclick="viewFile('${file.name}')"` : 
                    `onclick="changeDirectory('${file.name}')"`;
                
                fileItem.innerHTML = `
                    <div class="file-info" ${clickHandler}>
                        <i class="fas ${icon}"></i>
                        <span>${file.name}</span>
                    </div>
                    ${file.special !== 'parent' ? `
                        <div class="file-actions">
                            ${file.type === 'file' ? `
                                <button onclick="viewFile('${file.name}')">View</button>
                                <button onclick="editFile('${file.name}')">Edit</button>
                            ` : ''}
                            <button onclick="renameFile('${file.name}', event)">Rename</button>
                            <button onclick="deleteFile('${file.name}')">Delete</button>
                        </div>
                    ` : ''}
                `;
                fileList.appendChild(fileItem);
            });
        });
}

function viewFile(filename) {
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'read',
            filename: filename
        })
    })
    .then(response => response.json())
    .then(data => {
        const modal = document.getElementById('viewModal');
        const content = document.getElementById('viewContent');
        content.textContent = data.content;
        modal.style.display = 'block';
    });
}

function editFile(filename) {
    currentEditingFile = filename;
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'read',
            filename: filename
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('editContent').value = data.content;
        document.getElementById('editModal').style.display = 'block';
    });
}

function saveEdit() {
    const content = document.getElementById('editContent').value;
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'edit',
            filename: currentEditingFile,
            content: content
        })
    })
    .then(response => response.json())
    .then(() => {
        closeModal('editModal');
        refreshFiles();
    });
}

function deleteFile(filename) {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
        fetch('/file_operation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: 'delete',
                filename: filename
            })
        })
        .then(response => response.json())
        .then(() => refreshFiles());
    }
}

function createFile() {
    const filename = document.getElementById('newFileName').value;
    const content = document.getElementById('fileContent').value;
    
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'create',
            filename: filename,
            content: content
        })
    })
    .then(response => response.json())
    .then(() => {
        closeModal('createFileModal');
        refreshFiles();
    });
}

function createDirectory() {
    const dirname = document.getElementById('newDirName').value;
    
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'create_dir',
            filename: dirname
        })
    })
    .then(response => response.json())
    .then(() => {
        closeModal('createDirModal');
        refreshFiles();
    });
}

function changeDirectory(dirname) {
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'change_dir',
            filename: dirname
        })
    })
    .then(response => response.json())
    .then(() => refreshFiles());
}

function showCreateFileModal() {
    document.getElementById('createFileModal').style.display = 'block';
}

function showCreateDirModal() {
    document.getElementById('createDirModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function renameFile(filename, event) {
    event.stopPropagation();
    currentRenamingFile = filename;
    const renameInput = document.getElementById('renameFileName');  // Changed ID to avoid conflict
    renameInput.value = filename;
    document.getElementById('renameModal').style.display = 'block';
}

function saveRename() {
    const newName = document.getElementById('renameFileName').value.trim();  // Changed ID to match
    if (!newName) {
        alert('Please enter a new name');
        return;
    }
    
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'rename',
            filename: currentRenamingFile,
            new_name: newName
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            closeModal('renameModal');
            document.getElementById('renameFileName').value = '';
            currentRenamingFile = '';
            refreshFiles();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to rename file');
    });
}

// Modify the file-actions div in refreshFiles function to add rename button
function refreshFiles() {
    fetch('/list_files')
        .then(response => response.json())
        .then(data => {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
            document.getElementById('currentPath').textContent = data.current_path;
            
            data.files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                
                const icon = file.type === 'file' ? 'fa-file' : 'fa-folder';
                const clickHandler = file.type === 'file' ? 
                    `onclick="viewFile('${file.name}')"` : 
                    `onclick="changeDirectory('${file.name}')"`;
                
                fileItem.innerHTML = `
                    <div class="file-info" ${clickHandler}>
                        <i class="fas ${icon}"></i>
                        <span>${file.name}</span>
                    </div>
                    ${file.special !== 'parent' ? `
                        <div class="file-actions">
                            ${file.type === 'file' ? `
                                <button onclick="viewFile('${file.name}')">View</button>
                                <button onclick="editFile('${file.name}')">Edit</button>
                            ` : ''}
                            <button onclick="renameFile('${file.name}', event)">Rename</button>
                            <button onclick="deleteFile('${file.name}')">Delete</button>
                        </div>
                    ` : ''}
                `;
                fileList.appendChild(fileItem);
            });
        });
}

function viewFile(filename) {
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'read',
            filename: filename
        })
    })
    .then(response => response.json())
    .then(data => {
        const modal = document.getElementById('viewModal');
        const content = document.getElementById('viewContent');
        content.textContent = data.content;
        modal.style.display = 'block';
    });
}

// Remove this duplicate declaration (around line 300)
// let currentEditingFile = '';  // <-- Remove this line

function editFile(filename) {
    currentEditingFile = filename;
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'read',
            filename: filename
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('editContent').value = data.content;
        document.getElementById('editModal').style.display = 'block';
    });
}

function saveEdit() {
    const content = document.getElementById('editContent').value;
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'edit',
            filename: currentEditingFile,
            content: content
        })
    })
    .then(response => response.json())
    .then(() => {
        closeModal('editModal');
        refreshFiles();
    });
}

function deleteFile(filename) {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
        fetch('/file_operation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: 'delete',
                filename: filename
            })
        })
        .then(response => response.json())
        .then(() => refreshFiles());
    }
}

function createFile() {
    const filename = document.getElementById('newFileName').value;
    const content = document.getElementById('fileContent').value;
    
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'create',
            filename: filename,
            content: content
        })
    })
    .then(response => response.json())
    .then(() => {
        closeModal('createFileModal');
        refreshFiles();
    });
}

function createDirectory() {
    const dirname = document.getElementById('newDirName').value;
    
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'create_dir',
            filename: dirname
        })
    })
    .then(response => response.json())
    .then(() => {
        closeModal('createDirModal');
        refreshFiles();
    });
}

function changeDirectory(dirname) {
    fetch('/file_operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            operation: 'change_dir',
            filename: dirname
        })
    })
    .then(response => response.json())
    .then(() => refreshFiles());
}

function showCreateFileModal() {
    document.getElementById('createFileModal').style.display = 'block';
}

function showCreateDirModal() {
    document.getElementById('createDirModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Initial load
refreshFiles();