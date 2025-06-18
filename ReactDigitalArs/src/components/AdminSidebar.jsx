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
import GroupsIcon from '@mui/icons-material/Groups';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const drawerWidth = 240;

const AdminSidebar = ({
  onLogout,
  onTransacciones,
  onUsuarios,
  onCuentas,
  nombreUsuario,
}) => {
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
        <img
          src="/logo_DigitalArs.svg"
          alt="Logo de la empresa"
          style={{ width: '200px', marginBottom: '16px' }}
        />
        <Avatar sx={{ width: 80, height: 80, mb: 1 }} src="/user-avatar.png" />
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          {nombreUsuario || 'Cargando...'}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', my: 1 }} />

      <List>

        <ListItem button onClick={onUsuarios}>
          <ListItemIcon sx={{ color: 'white' }}>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
        </ListItem>

        <ListItem button onClick={onCuentas}>
          <ListItemIcon sx={{ color: 'white' }}>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Cuentas" />
        </ListItem>

        <ListItem button onClick={onTransacciones}>
          <ListItemIcon sx={{ color: 'white' }}>
            <SwapHorizIcon />
          </ListItemIcon>
          <ListItemText primary="Transacciones" />
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

export default AdminSidebar;