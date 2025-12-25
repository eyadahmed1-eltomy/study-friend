import React, { useState } from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  Box,
  Chip,
  Typography,
  Stack,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { Todo } from '../types';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTodo, setEditedTodo] = useState<Todo>(todo);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked ? 'completed' : 'pending';
    onUpdate({ ...todo, status: newStatus });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    onUpdate(editedTodo);
    setEditMode(false);
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    const updatedSubtasks = todo.subtasks.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    onUpdate({ ...todo, subtasks: updatedSubtasks });
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <>
      <ListItem
        sx={{
          bgcolor: 'background.paper',
          mb: 1,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Checkbox
          checked={todo.status === 'completed'}
          onChange={handleStatusChange}
        />
        <ListItemText
          primary={
            <Typography
              variant="h6"
              sx={{
                textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                color: todo.status === 'completed' ? 'text.secondary' : 'text.primary',
              }}
            >
              {todo.title}
            </Typography>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary">
                {todo.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip
                  label={todo.priority}
                  size="small"
                  color={getPriorityColor(todo.priority)}
                />
                {todo.category && (
                  <Chip label={todo.category} size="small" variant="outlined" />
                )}
                {todo.dueDate && (
                  <Chip
                    label={`Due: ${new Date(todo.dueDate).toLocaleDateString()}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          }
        />
        <IconButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <IconButton onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(todo.id)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Subtasks:
          </Typography>
          {todo.subtasks.map((subtask) => (
            <Box key={subtask.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Checkbox
                checked={subtask.completed}
                onChange={() => handleSubtaskToggle(subtask.id)}
              />
              <Typography
                sx={{
                  textDecoration: subtask.completed ? 'line-through' : 'none',
                  color: subtask.completed ? 'text.secondary' : 'text.primary',
                }}
              >
                {subtask.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>

      <Dialog open={editMode} onClose={() => setEditMode(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={editedTodo.title}
              onChange={(e) => setEditedTodo({ ...editedTodo, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={editedTodo.description}
              onChange={(e) => setEditedTodo({ ...editedTodo, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editedTodo.priority}
                label="Priority"
                onChange={(e) =>
                  setEditedTodo({
                    ...editedTodo,
                    priority: e.target.value as Todo['priority'],
                  })
                }
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Category"
              fullWidth
              value={editedTodo.category}
              onChange={(e) => setEditedTodo({ ...editedTodo, category: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={editedTodo.dueDate}
                onChange={(date) => setEditedTodo({ ...editedTodo, dueDate: date })}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TodoItem; 