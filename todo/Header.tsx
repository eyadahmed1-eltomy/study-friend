import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Add as AddIcon, FilterList as FilterListIcon } from '@mui/icons-material';

interface HeaderProps {
  onAddClick?: () => void;
  onFilterClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddClick, onFilterClick }) => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Advanced Todo List
        </Typography>
        <Box>
          <IconButton color="inherit" onClick={onFilterClick}>
            <FilterListIcon />
          </IconButton>
          <IconButton color="inherit" onClick={onAddClick}>
            <AddIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 