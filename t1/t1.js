const todoList = [
  {
    id: 1,
    task: 'Learn HTML',
    completed: true,
  },
  {
    id: 2,
    task: 'Learn CSS',
    completed: true,
  },
  {
    id: 3,
    task: 'Learn JS',
    completed: false,
  },
  {
    id: 4,
    task: 'Learn TypeScript',
    completed: false,
  },
  {
    id: 5,
    task: 'Learn React',
    completed: false,
  },
];

const ul = document.querySelector('ul');
const dialog = document.querySelector('dialog');
const form = document.querySelector('form');
const input = document.querySelector('input');
const addBtn = document.querySelector('.add-btn');

let nextId = Math.max(...todoList.map((item) => item.id)) + 1;

function logTodoList() {
  console.log(todoList);
}

function createTodoElement(todo) {
  const li = document.createElement('li');
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `todo-${todo.id}`;
  checkbox.checked = todo.completed;

  const label = document.createElement('label');
  label.htmlFor = checkbox.id;
  label.textContent = todo.task;

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'X';

  li.append(checkbox, label, deleteButton);
  ul.appendChild(li);
}

todoList.forEach(createTodoElement);

ul.addEventListener('change', (event) => {
  if (event.target.type !== 'checkbox') return;

  const li = event.target.closest('li');
  const id = Number(li.dataset.id);
  const item = todoList.find((todo) => todo.id === id);

  if (item) {
    item.completed = event.target.checked;
    logTodoList();
  }
});

ul.addEventListener('click', (event) => {
  if (event.target.tagName !== 'BUTTON') return;

  const li = event.target.closest('li');
  const id = Number(li.dataset.id);
  const index = todoList.findIndex((todo) => todo.id === id);

  if (index !== -1) {
    todoList.splice(index, 1);
    ul.removeChild(li);
    logTodoList();
  }
});

addBtn.addEventListener('click', () => {
  dialog.showModal();
  input.focus();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const task = input.value.trim();
  if (!task) return;

  const todo = {
    id: nextId++,
    task,
    completed: false,
  };

  todoList.push(todo);
  createTodoElement(todo);
  input.value = '';
  dialog.close();
  logTodoList();
});
