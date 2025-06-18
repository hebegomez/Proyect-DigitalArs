import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/AdminSidebar';
import {
  Box,
  Typography,
  Toolbar,
  AppBar,
} from '@mui/material';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        onRoles={() => navigate('/admin/roles')}
        onUsuarios={() => navigate('/admin/usuarios')}
        onCuentas={() => navigate('/admin/cuentas')}
        onTransacciones={() => navigate('/admin/transacciones')}
        onLogout={handleLogout}
        nombreUsuario="Administrador"
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f4f6f8',
          p: 3,
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
          <Toolbar>
            <Typography variant="h4" component="h1" color="#333">
              Panel de Administración
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Aquí se renderiza el componente hijo según la ruta */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminPage;