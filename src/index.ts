export type Task = Readonly<{
  id: number;
  text: string;
  completed?: boolean;
}>;

enum StorageKey {
  Tasks = 'myTasks',
  User = 'userName',
}

enum MaterialIcon {
  Edit = 'edit',
  Save = 'save',
  Delete = 'delete',
}

function getElementById<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Required element with id "${id}" not found.`);
  return element as T;
}

const newTaskInput = getElementById<HTMLInputElement>('newTaskInput');
const addTaskBtn = getElementById<HTMLButtonElement>('addTaskBtn');
const tasksList = getElementById<HTMLDivElement>('tasksList');
const welcomeTitle = getElementById<HTMLHeadingElement>('welcomeTitle');
const changeUserBtn = getElementById<HTMLButtonElement>('changeUserBtn');

let taskCounter = 0;

function addNewTask(): void {
  const taskText: string = newTaskInput.value.trim();
  if (!taskText) {
    alert('Please write something first!');
    return;
  }
  const taskId: number = ++taskCounter;
  const taskItem = renderTask({ id: taskId, text: taskText });
  tasksList.appendChild(taskItem);
  newTaskInput.value = '';
  persistTasks();
}

function iconSpan(icon: MaterialIcon): string {
  return `<span class="material-icons">${icon}</span>`;
}

function renderTask(task: Task): HTMLDivElement {
  const taskItem = document.createElement('div');
  taskItem.className = 'task-item';
  taskItem.setAttribute('data-id', String(task.id));

  const textDiv = document.createElement('div');
  textDiv.className = 'task-text';
  textDiv.textContent = task.text;
  if (task.completed) textDiv.classList.add('completed');

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
    if (taskItem.classList.contains('editing')) {
      const newText = editInput.value.trim();
      if (newText && newText !== textDiv.textContent) {
        textDiv.textContent = newText;
        persistTasks();
      }
      taskItem.classList.remove('editing');
      editBtn.innerHTML = iconSpan(MaterialIcon.Edit);
      editBtn.title = 'Edit';
    } else {
      taskItem.classList.add('editing');
      editInput.value = textDiv.textContent ?? '';
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

function persistTasks(): void {
  const allTasks: Task[] = [];
  const taskItems = tasksList.querySelectorAll<HTMLDivElement>('.task-item');
  taskItems.forEach((taskItem) => {
    const taskTextEl = taskItem.querySelector<HTMLDivElement>('.task-text');
    const idAttr = taskItem.getAttribute('data-id');
    if (!taskTextEl || !idAttr) return;
    const task: Task = { id: Number.parseInt(idAttr, 10), text: taskTextEl.textContent ?? '' };
    allTasks.push(task);
  });
  localStorage.setItem(StorageKey.Tasks, JSON.stringify(allTasks));
}

function restoreTasks(): void {
  const savedTasks = localStorage.getItem(StorageKey.Tasks);
  if (!savedTasks) return;
  try {
    const tasks: Task[] = JSON.parse(savedTasks) as Task[];
    tasks.forEach((task) => {
      renderTask(task);
    });
    taskCounter = tasks.length ? Math.max(...tasks.map((t) => t.id)) : 0;
  } catch {
    localStorage.removeItem(StorageKey.Tasks);
  }
}

function askForName(): void {
  const userName = prompt("What's your name?");
  if (!userName) {
    askForName();
  } else {
    localStorage.setItem(StorageKey.User, userName);
    welcomeTitle.textContent = `Hello, ${userName}!`;
  }
}

addTaskBtn.addEventListener('click', addNewTask);
changeUserBtn.addEventListener('click', askForName);

newTaskInput.addEventListener('keypress', (event: KeyboardEvent) => {
  if (event.key === 'Enter') addNewTask();
});

document.addEventListener('keypress', (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null;
  if (event.key === 'Enter' && target?.classList.contains('edit-input')) {
    const taskItem = target.closest('.task-item') as HTMLDivElement | null;
    const editBtn = taskItem?.querySelector<HTMLButtonElement>('.edit-btn');
    editBtn?.click();
  }
});

const savedName = localStorage.getItem(StorageKey.User);
if (!savedName) {
  askForName();
} else {
  welcomeTitle.textContent = `Welcome, ${savedName}!`;
}

restoreTasks();
  
  