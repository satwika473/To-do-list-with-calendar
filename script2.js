document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('input-box');
    const listContainer = document.getElementById('list-container');
    const calendar = document.getElementById('calendar');
    let selectedDate = new Date().toISOString().split('T')[0];

    // Function to generate calendar
    function generateCalendar() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        calendar.innerHTML = '';

        // Previous month's days
        for (let i = 1; i < firstDay.getDay(); i++) {
            const emptyDiv = document.createElement('div');
            calendar.appendChild(emptyDiv);
        }

        // Current month's days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dateDiv = document.createElement('div');
            const currentDate = new Date(year, month, i).toISOString().split('T')[0];
            dateDiv.textContent = i;
            dateDiv.dataset.date = currentDate;

            if (currentDate === selectedDate) {
                dateDiv.classList.add('selected');
            }
            if (currentDate === today.toISOString().split('T')[0]) {
                dateDiv.classList.add('today');
            }

            dateDiv.addEventListener('click', (event) => {
                selectedDate = event.target.dataset.date;
                document.querySelectorAll('#calendar div').forEach(div => div.classList.remove('selected'));
                event.target.classList.add('selected');
                loadTasks();
            });

            calendar.appendChild(dateDiv);
        }
    }

    // Load tasks from localStorage
    function loadTasks() {
        listContainer.innerHTML = '';
        const tasks = JSON.parse(localStorage.getItem(selectedDate) || '[]');
        tasks.forEach(task => addTaskElement(task));
    }

    // Add task
    window.addTask = () => {
        const taskText = inputBox.value.trim();
        if (taskText === '') {
            alert('You must write something!');
        } else {
            const tasks = JSON.parse(localStorage.getItem(selectedDate) || '[]');
            tasks.push({ text: taskText, checked: false });
            localStorage.setItem(selectedDate, JSON.stringify(tasks));
            addTaskElement({ text: taskText, checked: false });
            inputBox.value = '';
        }
    };

    // Add task element to the list
    function addTaskElement(task) {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.checked) {
            li.classList.add('checked');
        }
        listContainer.appendChild(li);

        li.addEventListener('click', () => {
            li.classList.toggle('checked');
            updateTask(li.textContent, li.classList.contains('checked'));
        });

        const span = document.createElement('span');
        span.textContent = '\u00D7';
        span.classList.add('close');
        li.appendChild(span);

        span.addEventListener('click', () => {
            li.style.display = 'none';
            removeTask(li.textContent);
        });
    }

    // Update task in localStorage
    function updateTask(text, checked) {
        const tasks = JSON.parse(localStorage.getItem(selectedDate) || '[]');
        const taskIndex = tasks.findIndex(task => task.text === text);
        if (taskIndex > -1) {
            tasks[taskIndex].checked = checked;
            localStorage.setItem(selectedDate, JSON.stringify(tasks));
        }
    }

    // Remove task from localStorage
    function removeTask(text) {
        let tasks = JSON.parse(localStorage.getItem(selectedDate) || '[]');
        tasks = tasks.filter(task => task.text !== text);
        localStorage.setItem(selectedDate, JSON.stringify(tasks));
    }

    generateCalendar();
    loadTasks();
});
