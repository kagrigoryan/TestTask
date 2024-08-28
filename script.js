document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToDOM(task));
    };

    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

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

    const addTask = (text) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTask = {
            id: Date.now(),
            text,
            completed: false
        };
        tasks.push(newTask);
        saveTasks(tasks);
        addTaskToDOM(newTask);
    };

    const toggleTask = (id) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.id === id);
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks();
    };

    const deleteTask = (id) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(t => t.id !== id);
        saveTasks(updatedTasks);
        renderTasks();
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToDOM(task));
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    loadTasks();
});
