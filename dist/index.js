var StorageKey;
(function (StorageKey) {
    StorageKey["Tasks"] = "myTasks";
    StorageKey["User"] = "userName";
})(StorageKey || (StorageKey = {}));
var MaterialIcon;
(function (MaterialIcon) {
    MaterialIcon["Edit"] = "edit";
    MaterialIcon["Save"] = "save";
    MaterialIcon["Delete"] = "delete";
})(MaterialIcon || (MaterialIcon = {}));
function getElementById(id) {
    const element = document.getElementById(id);
    if (!element)
        throw new Error(`Required element with id "${id}" not found.`);
    return element;
}
const newTaskInput = getElementById('newTaskInput');
const addTaskBtn = getElementById('addTaskBtn');
const tasksList = getElementById('tasksList');
const welcomeTitle = getElementById('welcomeTitle');
const changeUserBtn = getElementById('changeUserBtn');
let taskCounter = 0;
function addNewTask() {
    const taskText = newTaskInput.value.trim();
    if (!taskText) {
        alert('Please write something first!');
        return;
    }
    const taskId = ++taskCounter;
    const taskItem = renderTask({ id: taskId, text: taskText });
    tasksList.appendChild(taskItem);
    newTaskInput.value = '';
    persistTasks();
}
function iconSpan(icon) {
    return `<span class="material-icons">${icon}</span>`;
}
function renderTask(task) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.setAttribute('data-id', String(task.id));
    const textDiv = document.createElement('div');
    textDiv.className = 'task-text';
    textDiv.textContent = task.text;
    if (task.completed)
        textDiv.classList.add('completed');
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = task.text;
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'task-buttons';
    const editBtn = document.createElement('button');
    editBtn.className = 'task-btn edit-btn';
    editBtn.innerHTML = iconSpan(MaterialIcon.Edit);
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', () => {
        var _a;
        if (taskItem.classList.contains('editing')) {
            const newText = editInput.value.trim();
            if (newText && newText !== textDiv.textContent) {
                textDiv.textContent = newText;
                persistTasks();
            }
            taskItem.classList.remove('editing');
            editBtn.innerHTML = iconSpan(MaterialIcon.Edit);
            editBtn.title = 'Edit';
        }
        else {
            taskItem.classList.add('editing');
            editInput.value = (_a = textDiv.textContent) !== null && _a !== void 0 ? _a : '';
            editBtn.innerHTML = iconSpan(MaterialIcon.Save);
            editBtn.title = 'Save';
            setTimeout(() => {
                editInput.focus();
                editInput.select();
            }, 10);
        }
    });
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-btn delete-btn';
    deleteBtn.innerHTML = iconSpan(MaterialIcon.Delete);
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', () => {
        if (tasksList.contains(taskItem)) {
            tasksList.removeChild(taskItem);
            persistTasks();
        }
    });
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);
    taskItem.appendChild(textDiv);
    taskItem.appendChild(editInput);
    taskItem.appendChild(buttonsDiv);
    tasksList.appendChild(taskItem);
    return taskItem;
}
function persistTasks() {
    const allTasks = [];
    const taskItems = tasksList.querySelectorAll('.task-item');
    taskItems.forEach((taskItem) => {
        var _a;
        const taskTextEl = taskItem.querySelector('.task-text');
        const idAttr = taskItem.getAttribute('data-id');
        if (!taskTextEl || !idAttr)
            return;
        const task = { id: Number.parseInt(idAttr, 10), text: (_a = taskTextEl.textContent) !== null && _a !== void 0 ? _a : '' };
        allTasks.push(task);
    });
    localStorage.setItem(StorageKey.Tasks, JSON.stringify(allTasks));
}
function restoreTasks() {
    const savedTasks = localStorage.getItem(StorageKey.Tasks);
    if (!savedTasks)
        return;
    try {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach((task) => {
            renderTask(task);
        });
        taskCounter = tasks.length ? Math.max(...tasks.map((t) => t.id)) : 0;
    }
    catch (_a) {
        localStorage.removeItem(StorageKey.Tasks);
    }
}
function askForName() {
    const userName = prompt("What's your name?");
    if (!userName) {
        askForName();
    }
    else {
        localStorage.setItem(StorageKey.User, userName);
        welcomeTitle.textContent = `Hello, ${userName}!`;
    }
}
addTaskBtn.addEventListener('click', addNewTask);
changeUserBtn.addEventListener('click', askForName);
newTaskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter')
        addNewTask();
});
document.addEventListener('keypress', (event) => {
    const target = event.target;
    if (event.key === 'Enter' && (target === null || target === void 0 ? void 0 : target.classList.contains('edit-input'))) {
        const taskItem = target.closest('.task-item');
        const editBtn = taskItem === null || taskItem === void 0 ? void 0 : taskItem.querySelector('.edit-btn');
        editBtn === null || editBtn === void 0 ? void 0 : editBtn.click();
    }
});
const savedName = localStorage.getItem(StorageKey.User);
if (!savedName) {
    askForName();
}
else {
    welcomeTitle.textContent = `Welcome, ${savedName}!`;
}
restoreTasks();
export {};
//# sourceMappingURL=index.js.map