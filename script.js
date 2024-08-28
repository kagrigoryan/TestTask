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
            <span>${task.text}</span>
            <button class="delete-task"><i class="fas fa-trash"></i></button>
        `;

        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const deleteButton = taskElement.querySelector('.delete-task');
        deleteButton.addEventListener('click', () => deleteTask(task.id));

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