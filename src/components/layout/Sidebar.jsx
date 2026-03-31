import React from 'react';
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import HealingIcon from '@mui/icons-material/Healing';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ChatIcon from '@mui/icons-material/Chat';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import GrassIcon from '@mui/icons-material/Grass';

import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Disease Detection', icon: <HealingIcon />, path: '/disease-detection' },
  { text: 'Weather', icon: <WbSunnyIcon />, path: '/weather' },
  { text: 'Market Prices', icon: <AttachMoneyIcon />, path: '/market' },
  { text: 'Fertilizer', icon: <GrassIcon />, path: '/fertilizer' },
  { text: 'AI Assistant', icon: <ChatIcon />, path: '/chatbot' },
  { text: 'Crop Calendar', icon: <CalendarTodayIcon />, path: '/crop-calendar' },
  { text: 'YouTube Tutorials', icon: <YouTubeIcon />, path: '/youtube' },
  { text: 'Community', icon: <PeopleIcon />, path: '/community' },
];

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          ...(open ? {} : { width: 0, overflow: 'hidden' }),
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default Sidebar;