const createButton = document.getElementById('createButton');
const createTaskModal = document.getElementById('createTaskModal');
const taskNameInput = document.getElementById('taskNameInput');
const linkedTaskSelect = document.getElementById('linkedTaskSelect');
const createTaskBtn = document.getElementById('createTaskBtn');
const searchInput = document.querySelector('.search-bar');
const taskList = document.getElementById('taskList');

const tasks = [];

createButton.addEventListener('click', () => {
  createTaskModal.style.display = 'block';
  populateLinkedTaskOptions();
});

createTaskBtn.addEventListener('click', () => {
  const newTaskName = taskNameInput.value.trim();
  const selectedTask = linkedTaskSelect.value;

  if (newTaskName !== '') {
    const newTask = { name: newTaskName, linkedTask: selectedTask, referencedBy: [] };
    tasks.push(newTask);
    if (selectedTask !== '') {
      const linkedTask = tasks.find(task => task.name === selectedTask);
      linkedTask.referencedBy.push(newTaskName);
    }
    updateTaskList();
    clearInputs();
  }

  createTaskModal.style.display = 'none';
});

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm) ||
    (task.linkedTask && task.linkedTask.toLowerCase().includes(searchTerm))
  );
  updateTaskList(filteredTasks);
});

function updateTaskList(filteredTasks = tasks) {
  taskList.innerHTML = '';
  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task';
    taskItem.textContent = task.name;

    if (task.linkedTask) {
      const linkedTaskSpan = document.createElement('span');
      linkedTaskSpan.className = 'linked-task';
      linkedTaskSpan.textContent = `<> ${task.linkedTask}`;
      taskItem.appendChild(linkedTaskSpan);
    }

    if (task.referencedBy.length > 0) {
      const referencedBySpan = document.createElement('span');
      referencedBySpan.className = 'referenced-by';
      referencedBySpan.textContent = `Referenced by: ${task.referencedBy.join(', ')}`;
      taskItem.appendChild(referencedBySpan);

      const referenceCountSpan = document.createElement('span');
      referenceCountSpan.className = 'reference-count';
      referenceCountSpan.textContent = `(${task.referencedBy.length} referenced)`;
      taskItem.appendChild(referenceCountSpan);
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteTask(index);
    });
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
  });
}

function populateLinkedTaskOptions() {
  linkedTaskSelect.innerHTML = '<option value="">Select a linked task (optional)</option>';
  tasks.forEach(task => {
    const option = document.createElement('option');
    option.value = task.name;
    option.textContent = task.name;
    linkedTaskSelect.appendChild(option);
  });
}

function clearInputs() {
  taskNameInput.value = '';
  linkedTaskSelect.value = '';
}

function deleteTask(index) {
  const taskToDelete = tasks[index];
  tasks.splice(index, 1);

  // Remove references from other tasks
  tasks.forEach(task => {
    const referencedIndex = task.referencedBy.indexOf(taskToDelete.name);
    if (referencedIndex !== -1) {
      task.referencedBy.splice(referencedIndex, 1);
    }
  });

  updateTaskList();
}
function updateTask(index) {
  const editedTaskName = taskNameInput.value.trim();
  const editedLinkedTask = linkedTaskSelect.value;

  if (editedTaskName !== '') {
    tasks[index].name = editedTaskName;
    tasks[index].linkedTask = editedLinkedTask;
    updateTaskList();
    clearInputs();
    closeCreateModal();
  }
}

function markTaskAsCompleted(index) {
  tasks[index].completed = true;
  updateTaskList();
}

// Initial update of task list
updateTaskList();