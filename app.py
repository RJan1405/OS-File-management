from flask import Flask, render_template, request, jsonify
import os
import shutil
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/list_files')
def list_files():
    files = []
    current_path = os.getcwd()
    if os.path.abspath(current_path) != os.path.abspath(os.path.sep):
        files.append({
            'name': '..',
            'type': 'directory',
            'special': 'parent'
        })
    
    for item in os.listdir():
        if os.path.isfile(item):
            stats = os.stat(item)
            files.append({
                'name': item,
                'size': os.path.getsize(item),
                'type': 'file',
                'modified': time.ctime(stats.st_mtime)
            })
        else:
            stats = os.stat(item)
            files.append({
                'name': item,
                'type': 'directory',
                'modified': time.ctime(stats.st_mtime)
            })
    return jsonify({
        'files': files,
        'current_path': current_path
    })

@app.route('/file_operation', methods=['POST'])
def file_operation():
    operation = request.json.get('operation')
    filename = request.json.get('filename')
    content = request.json.get('content', '')
    
    try:
        if operation == 'create':
            with open(filename, 'w') as f:
                f.write(content)
            return jsonify({'status': 'success'})
            
        elif operation == 'read':
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            return jsonify({'content': content})
            
        elif operation == 'edit':
            with open(filename, 'w') as f:
                f.write(content)
            return jsonify({'status': 'success'})
            
        elif operation == 'rename':
            new_name = request.json.get('new_name', '')
            if new_name and filename:
                try:
                    os.rename(os.path.join(os.getcwd(), filename), 
                             os.path.join(os.getcwd(), new_name))
                    return jsonify({'status': 'success'})
                except OSError as e:
                    return jsonify({'error': f'Failed to rename: {str(e)}'})
            return jsonify({'error': 'Invalid filename or new name'})
            
        elif operation == 'delete':
            if os.path.isfile(filename):
                os.remove(filename)
            else:
                shutil.rmtree(filename)
            return jsonify({'status': 'success'})
            
        elif operation == 'create_dir':
            os.makedirs(filename, exist_ok=True)
            return jsonify({'status': 'success'})
            
        elif operation == 'change_dir':
            if filename == '..':
                os.chdir('..')
            else:
                os.chdir(filename)
            return jsonify({
                'status': 'success',
                'new_path': os.getcwd()
            })
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)