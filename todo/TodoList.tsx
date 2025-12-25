import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  List,
  Typography,
  Fab,
  Dialog,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { Todo, TodoFilter } from '../types';
import TodoItem from './TodoItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<TodoFilter>({});
  const [newTodo, setNewTodo] = useState<Partial<Todo>>({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    status: 'pending',
    tags: [],
    subtasks: [],
  });

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    const todo: Todo = {
      id: uuidv4(),
      title: newTodo.title || '',
      description: newTodo.description || '',
      dueDate: newTodo.dueDate || null,
      priority: newTodo.priority || 'medium',
      category: newTodo.category || '',
      status: newTodo.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: newTodo.tags || [],
      subtasks: newTodo.subtasks || [],
    };

    setTodos([...todos, todo]);
    setOpen(false);
    setNewTodo({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      status: 'pending',
      tags: [],
      subtasks: [],
    });
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map(todo => 
      todo.id === updatedTodo.id ? { ...updatedTodo, updatedAt: new Date() } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter.status && todo.status !== filter.status) return false;
    if (filter.priority && todo.priority !== filter.priority) return false;
    if (filter.category && todo.category !== filter.category) return false;
    if (filter.searchTerm && !todo.title.toLowerCase().includes(filter.searchTerm.toLowerCase())) return false;
    if (filter.dueDate && todo.dueDate && new Date(todo.dueDate).toDateString() !== filter.dueDate.toDateString()) return false;
    return true;
  });

  return (
    <>
    <Box>
      <>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter.status || ''}
              label="Status"
              onChange={(e) => setFilter({ ...filter, status: e.target.value as Todo['status'] })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filter.priority || ''}
              label="Priority"
              onChange={(e) => setFilter({ ...filter, priority: e.target.value as Todo['priority'] })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          </>
        </Stack>
        </>
      </Paper>
      </>

      <List>
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add New Todo
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Title"
              fullWidth
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            /><>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            />
            </>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTodo.priority}
                label="Priority"
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as Todo['priority'] })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Category"
              fullWidth
              value={newTodo.category}
              onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={newTodo.dueDate}
                onChange={(date) => setNewTodo({ ...newTodo, dueDate: date })}
              />
            </LocalizationProvider>
            <Button variant="contained" onClick={handleAddTodo}>
              Add Todo
            </Button>
          </Stack>
        </Box>
      </Dialog>

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>
    </Box>
    </>
  );
};

export default TodoList; 