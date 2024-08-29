<template>
    <div class="container">
        <div class="header">
            <h1>Task Tracker</h1>
            <div class="tabs">
                <button :class="{ active: activeTab === 'active' }" @click="activeTab = 'active'">Текущие задачи</button>
                <button :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">Выполненные</button>
            </div>
            <form v-if="activeTab === 'active'" @submit.prevent="addTask">
                <input type="text" v-model="newTask" placeholder="Добавьте свою задачу" required>
                <button type="submit"><i class="fas fa-tasks"></i></button>
            </form>
        </div>
        <ul>
            <li v-for="task in filteredTasks" :key="task.id" :class="{ completed: task.completed }">
                <button @click="toggleTaskCompletion(task)">
                    <i v-if="task.completed" class="far fa-circle"></i>
                    <i v-else class="fas fa-check"></i>
                </button>
                <span v-if="!task.editing" class="task-text">{{ task.title }}</span>
                <input v-else type="text" class="task-edit-input" v-model="task.title" @blur="saveEditing(task)" @keydown.enter="saveEditing(task)">
                <div>
                    <button v-if="!task.editing" @click="startEditing(task)" class="edit-button"><i class="fas fa-edit"></i></button>
                    <button v-else @click="saveEditing(task)" class="save-button"><i class="fas fa-save"></i></button>
                    <button @click="deleteTask(task.id)" class="delete-button"><i class="fas fa-trash"></i></button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tasks: [],
            newTask: '',
            activeTab: 'active'
        };
    },
    computed: {
        filteredTasks() {
            return this.tasks.filter(task => task.completed === (this.activeTab === 'completed'));
        }
    },
    mounted() {
        this.loadTasks();
    },
    methods: {
        loadTasks() {
            const tasks = localStorage.getItem('tasks');
            if (tasks) {
                this.tasks = JSON.parse(tasks).map(task => ({ ...task, editing: false }));
            }
        },
        saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks.map(task => ({ id: task.id, title: task.title, completed: task.completed }))));
        },
        addTask() {
            if (this.newTask.trim() === '') return;
            const newTask = {
                id: Date.now(),
                title: this.newTask,
                completed: false,
                editing: false
            };
            this.tasks.push(newTask);
            this.saveTasks();
            this.newTask = '';
        },
        deleteTask(id) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
        },
        toggleTaskCompletion(task) {
            task.completed = !task.completed;
            this.saveTasks();
        },
        startEditing(task) {
            task.editing = true;
        },
        saveEditing(task) {
            task.editing = false;
            this.saveTasks();
        }
    }
};
</script>

<style scoped>
@import '../assets/styles.css';
</style>