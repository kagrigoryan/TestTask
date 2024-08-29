document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Load tasks from Local Storage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        renderTasks(tasks);
    };

    // Save tasks to Local Storage
    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Add task to DOM
    const addTaskToDOM = (task) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        if (task.completed) {
            taskElement.classList.add('completed');
        }

        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="edit-task"><i class="fas fa-edit"></i></button>
            <button class="delete-task"><i class="fas fa-trash"></i></button>
        `;

        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const deleteButton = taskElement.querySelector('.delete-task');
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        const editButton = taskElement.querySelector('.edit-task');
        editButton.addEventListener('click', () => editTask(task.id, taskElement));

        taskList.appendChild(taskElement);
    };

    // Add new task
    const addTask = (text) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTask = {
            id: Date.now(),
            text,
            completed: false
        };
        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks(tasks);
    };

    // Toggle task completion
    const toggleTask = (id) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.id === id);
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks(tasks);
    };

    // Delete task
    const deleteTask = (id) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(t => t.id !== id);
        saveTasks(updatedTasks);
        renderTasks(updatedTasks);
    };

    // Edit task
    const editTask = (id, taskElement) => {
        const taskTextElement = taskElement.querySelector('.task-text');
        const currentText = taskTextElement.textContent;

        // Create input field and save button
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentText;
        editInput.classList.add('task-edit-input');

        const saveButton = document.createElement('button');
        saveButton.innerHTML = '<i class="fas fa-check"></i>';
        saveButton.classList.add('save-task');
        saveButton.addEventListener('click', () => saveEditedTask(id, editInput.value, taskElement));

        // Replace task text with input field and save button
        taskTextElement.replaceWith(editInput);
        const editButton = taskElement.querySelector('.edit-task');
        editButton.style.display = 'none';

        // Insert save button before delete button
        const deleteButton = taskElement.querySelector('.delete-task');
        taskElement.insertBefore(saveButton, deleteButton);
    };

    // Save edited task
    const saveEditedTask = (id, newText, taskElement) => {
        if (newText.trim() !== '') {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const task = tasks.find(t => t.id === id);
            task.text = newText.trim();
            saveTasks(tasks);
            renderTasks(tasks);
        }
    };

    // Render tasks
    const renderTasks = (tasks) => {
        taskList.innerHTML = '';
        const sortedTasks = tasks.sort((a, b) => a.completed - b.completed);
        sortedTasks.forEach(task => addTaskToDOM(task));

        // Smoothly move tasks to their new positions
        const taskElements = document.querySelectorAll('.task');
        taskElements.forEach(taskElement => {
            taskList.appendChild(taskElement);
        });
    };

    // Event listener for form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    // Load tasks on page load
    loadTasks();
});