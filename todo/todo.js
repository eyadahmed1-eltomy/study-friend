document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const deadlineInput = document.getElementById('deadline-input');
    const todoList = document.getElementById('todo-list');
    const searchInput = document.getElementById('search-input');
    const filterStatus = document.getElementById('filter-status');
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const editTaskInput = document.getElementById('edit-task-input');
    const editDeadlineInput = document.getElementById('edit-deadline-input');
    const closeModal = document.getElementById('close-modal');
    const cancelEdit = document.getElementById('cancel-edit');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let editingTodoId = null;

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateTimeRemaining = (deadline) => {
        if (!deadline) return null;
        
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diff = deadlineDate - now;
        
        if (diff <= 0) return { overdue: true, text: '⚠️ OVERDUE' };
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
            return { overdue: false, text: `⏰ ${days}d ${hours}h remaining`, urgent: false, warning: false };
        } else if (hours > 0) {
            return { overdue: false, text: `⏰ ${hours}h ${minutes}m remaining`, urgent: hours < 2, warning: hours < 6 };
        } else {
            return { overdue: false, text: `⏰ ${minutes}m remaining`, urgent: true, warning: false };
        }
    };

    const getTimeRemainingClass = (timeRemaining) => {
        if (!timeRemaining) return '';
        if (timeRemaining.overdue) return 'urgent';
        if (timeRemaining.urgent) return 'urgent';
        if (timeRemaining.warning) return 'warning';
        return 'normal';
    };

    const isOverdue = (todo) => {
        if (!todo.deadline || todo.completed) return false;
        return new Date(todo.deadline) < new Date();
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();
        const statusFilter = filterStatus.value;

        const filteredTodos = todos.filter(todo => {
            const matchesSearch = todo.text.toLowerCase().includes(searchTerm);
            let matchesStatus = true;
            
            if (statusFilter === 'completed') {
                matchesStatus = todo.completed;
            } else if (statusFilter === 'pending') {
                matchesStatus = !todo.completed;
            } else if (statusFilter === 'overdue') {
                matchesStatus = isOverdue(todo);
            }
            
            return matchesSearch && matchesStatus;
        });

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            if (isOverdue(todo)) {
                li.classList.add('overdue');
            }
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'todo-item-content';
            
            const textDiv = document.createElement('div');
            textDiv.className = 'todo-item-text';
            textDiv.textContent = todo.text;
            contentDiv.appendChild(textDiv);
            
            if (todo.deadline) {
                const deadlineDiv = document.createElement('div');
                deadlineDiv.className = 'todo-item-deadline';
                deadlineDiv.textContent = `📅 Deadline: ${formatDateTime(todo.deadline)}`;
                contentDiv.appendChild(deadlineDiv);
                
                const timeRemaining = calculateTimeRemaining(todo.deadline);
                if (timeRemaining && !todo.completed) {
                    const timeRemainingDiv = document.createElement('div');
                    timeRemainingDiv.className = `todo-item-time-remaining ${getTimeRemainingClass(timeRemaining)}`;
                    timeRemainingDiv.textContent = timeRemaining.text;
                    contentDiv.appendChild(timeRemainingDiv);
                }
            }
            
            li.appendChild(contentDiv);

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
            editBtn.addEventListener('click', () => {
                openEditModal(todo);
            });
            li.appendChild(editBtn);

            const completeBtn = document.createElement('button');
            completeBtn.className = 'complete-btn';
            completeBtn.innerHTML = `<i class="fas fa-check"></i>`;
            completeBtn.addEventListener('click', () => {
                todo.completed = !todo.completed;
                saveTodos();
                renderTodos();
            });
            li.appendChild(completeBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
            deleteBtn.addEventListener('click', () => {
                todos = todos.filter(t => t.id !== todo.id);
                saveTodos();
                renderTodos();
            });
            li.appendChild(deleteBtn);
            
            todoList.appendChild(li);
        });
    };

    const openEditModal = (todo) => {
        editingTodoId = todo.id;
        editTaskInput.value = todo.text;
        editDeadlineInput.value = todo.deadline || '';
        editModal.style.display = 'block';
    };

    const closeEditModal = () => {
        editModal.style.display = 'none';
        editingTodoId = null;
        editTaskInput.value = '';
        editDeadlineInput.value = '';
    };

    const updateTimeRemaining = () => {
        const timeRemainingElements = document.querySelectorAll('.todo-item-time-remaining');
        timeRemainingElements.forEach(element => {
            const li = element.closest('li');
            const todoId = li.dataset.todoId;
            const todo = todos.find(t => t.id == todoId);
            if (todo && todo.deadline) {
                const timeRemaining = calculateTimeRemaining(todo.deadline);
                if (timeRemaining) {
                    element.textContent = timeRemaining.text;
                    element.className = `todo-item-time-remaining ${getTimeRemainingClass(timeRemaining)}`;
                }
            }
        });
    };

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTodo = {
            id: Date.now(),
            text: todoInput.value,
            completed: false,
            deadline: deadlineInput.value || null
        };
        todos.push(newTodo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
        deadlineInput.value = '';
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (editingTodoId) {
            const todo = todos.find(t => t.id === editingTodoId);
            if (todo) {
                todo.text = editTaskInput.value;
                todo.deadline = editDeadlineInput.value || null;
                saveTodos();
                renderTodos();
            }
        }
        closeEditModal();
    });

    // closeModal.addEventListener('click', closeEditModal);
    // cancelEdit.addEventListener('click', closeEditModal);

    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    searchInput.addEventListener('input', renderTodos);
    filterStatus.addEventListener('change', renderTodos);

    // Update time remaining every minute
    setInterval(() => {
        updateTimeRemaining();
    }, 60000);

    // Initial render
    renderTodos();
}); 