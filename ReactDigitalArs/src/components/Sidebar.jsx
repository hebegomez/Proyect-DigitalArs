import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const Sidebar = ({ onLogout, onDepositar, onRetirar, onTransferencias, nombreUsuario }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#6F04D9',
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
        }}
      >
        <br></br>
        <img
          src="/logo_DigitalArs.svg"
          alt="Logo de la empresa"
          style={{ width: '200px', marginBottom: '16px' }}
        />
        <br></br>
        <Avatar sx={{ width: 80, height: 80, mb: 1 }} src="/user-avatar.png" />
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          {nombreUsuario || 'Cargando...'}
        </Typography>
      </Box>
<Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', my: 1 }} />

      <List sx={{ px: 1 }}>
        <ListItem button onClick={onTransferencias}>
          <ListItemIcon sx={{ color: 'white' }}>
            <SwapHorizIcon />
          </ListItemIcon>
          <ListItemText primary="Transferencias" />
        </ListItem>

        <ListItem button onClick={onDepositar}>
          <ListItemIcon sx={{ color: 'white' }}>
            <AttachMoneyIcon />
          </ListItemIcon>
          <ListItemText primary="Depositar" />
        </ListItem>

        <ListItem button onClick={onRetirar}>
          <ListItemIcon sx={{ color: 'white' }}>
            <MoneyOffIcon />
          </ListItemIcon>
          <ListItemText primary="Retirar" />
        </ListItem>
<Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', my: 1 }} />

        <ListItem button onClick={onLogout}>
          <ListItemIcon sx={{ color: 'white' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;