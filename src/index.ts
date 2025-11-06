export type Task = {
  id: number;
  text: string;
};

const newTaskInput = document.getElementById('newTaskInput') as HTMLInputElement;
const addTaskBtn = document.getElementById('addTaskBtn') as HTMLButtonElement;
const tasksList = document.getElementById('tasksList') as HTMLDivElement;
const welcomeTitle = document.getElementById('welcomeTitle') as HTMLHeadingElement;
const changeUserBtn = document.getElementById('changeUserBtn') as HTMLButtonElement;

let taskCounter = 0;

function addNewTask(): void {
    const taskText = newTaskInput.value.trim();
    
    if (!taskText) {
        alert("Please write something first!");
        return;
    }
    
    const taskId = ++taskCounter;
    const taskItem = makeNewTask(taskText, taskId);
    
    tasksList.appendChild(taskItem);
    newTaskInput.value = '';
    saveAllTasks();
}

function makeNewTask(taskText: string, taskId: number): HTMLDivElement {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.setAttribute('data-id', taskId.toString());
    
    const textDiv = document.createElement('div');
    textDiv.className = 'task-text';
    textDiv.textContent = taskText;
    
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = taskText;
    
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'task-buttons';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'task-btn edit-btn';
    editBtn.innerHTML = '<span class="material-icons">edit</span>';
    editBtn.title = 'Edit';

    editBtn.addEventListener('click', function() {
        if (taskItem.classList.contains('editing')) {
            const newText = editInput.value.trim();
            if (newText && newText !== textDiv.textContent) {
                textDiv.textContent = newText;
                saveAllTasks();
            }
            taskItem.classList.remove('editing');
            editBtn.innerHTML = '<span class="material-icons">edit</span>';
            editBtn.title = 'Edit';
        } else {
            taskItem.classList.add('editing');
            editInput.value = textDiv.textContent || '';
            editBtn.innerHTML = '<span class="material-icons">save</span>';
            editBtn.title = 'Save';
            
            setTimeout(() => {
                editInput.focus();
                editInput.select();
            }, 10);
        }
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-btn delete-btn';
    deleteBtn.innerHTML = '<span class="material-icons">delete</span>';
    deleteBtn.title = 'Delete';

    deleteBtn.addEventListener('click', function() {
        tasksList.removeChild(taskItem);
        saveAllTasks();
    });
    
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);
    
    taskItem.appendChild(textDiv);
    taskItem.appendChild(editInput);
    taskItem.appendChild(buttonsDiv);
    tasksList.appendChild(taskItem);

    return taskItem;
}

function saveAllTasks(): void {
    const allTasks: Task[] = [];
    const taskItems = tasksList.querySelectorAll('.task-item');
    taskItems.forEach(taskItem => {
        const taskText = taskItem.querySelector('.task-text');
        const idAttr = taskItem.getAttribute('data-id');
        if (taskText && idAttr) {
            allTasks.push({
                id: parseInt(idAttr),
                text: taskText.textContent || ''
            });
        }
    });
    localStorage.setItem('myTasks', JSON.stringify(allTasks));
}

function loadSavedTasks(): void {
    const savedTasks = localStorage.getItem('myTasks');
    if (savedTasks) {
        const tasks: Task[] = JSON.parse(savedTasks);
        tasks.forEach(task => {
            makeNewTask(task.text, task.id);
        });
        taskCounter = Math.max(...tasks.map(t => t.id), 0);
    }
}

function askForName(): void {
    const userName = prompt("What's your name?");
    if (!userName) {
        askForName();
    } else {
        localStorage.setItem("userName", userName);
        welcomeTitle.textContent = `Hello, ${userName}!`;
    }
}

addTaskBtn.addEventListener('click', addNewTask);
changeUserBtn.addEventListener('click', askForName);

newTaskInput.addEventListener('keypress', function(event: KeyboardEvent) {
    if (event.key === 'Enter') {
        addNewTask();
    }
});

document.addEventListener('keypress', function(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.target as HTMLElement).classList.contains('edit-input')) {
        const taskItem = (event.target as HTMLElement).closest('.task-item');
        const editBtn = taskItem?.querySelector('.edit-btn') as HTMLButtonElement;
        editBtn?.click();
    }
});

if (!localStorage.getItem("userName")) {
    askForName();
} else {
    const savedName = localStorage.getItem("userName");
    welcomeTitle.textContent = `Welcome, ${savedName}!`;
}

loadSavedTasks();