const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const welcomeTitle = document.getElementById('welcomeTitle');
const changeUserBtn = document.getElementById('changeUserBtn');
let taskCounter = 0;
function addNewTask() {
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
function makeNewTask(taskText, taskId) {
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
    editBtn.addEventListener('click', function () {
        if (taskItem.classList.contains('editing')) {
            const newText = editInput.value.trim();
            if (newText && newText !== textDiv.textContent) {
                textDiv.textContent = newText;
                saveAllTasks();
            }
            taskItem.classList.remove('editing');
            editBtn.innerHTML = '<span class="material-icons">edit</span>';
            editBtn.title = 'Edit';
        }
        else {
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
    deleteBtn.addEventListener('click', function () {
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
function saveAllTasks() {
    const allTasks = [];
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
function loadSavedTasks() {
    const savedTasks = localStorage.getItem('myTasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            makeNewTask(task.text, task.id);
        });
        taskCounter = Math.max(...tasks.map(t => t.id), 0);
    }
}
function askForName() {
    const userName = prompt("What's your name?");
    if (!userName) {
        askForName();
    }
    else {
        localStorage.setItem("userName", userName);
        welcomeTitle.textContent = `Hello, ${userName}!`;
    }
}
addTaskBtn.addEventListener('click', addNewTask);
changeUserBtn.addEventListener('click', askForName);
newTaskInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addNewTask();
    }
});
document.addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && event.target.classList.contains('edit-input')) {
        const taskItem = event.target.closest('.task-item');
        const editBtn = taskItem === null || taskItem === void 0 ? void 0 : taskItem.querySelector('.edit-btn');
        editBtn === null || editBtn === void 0 ? void 0 : editBtn.click();
    }
});
if (!localStorage.getItem("userName")) {
    askForName();
}
else {
    const savedName = localStorage.getItem("userName");
    welcomeTitle.textContent = `Welcome, ${savedName}!`;
}
loadSavedTasks();
export {};
//# sourceMappingURL=index.js.map