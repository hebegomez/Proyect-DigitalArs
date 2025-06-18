import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

const AdminCuentas = () => {
  const [cuentas, setCuentas] = useState([]);

  // Estado para controlar Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Opcional: mensaje dinámico si quisieras cambiar texto, pero acá fijo
  const mensajeSnackbar = "Funcionalidad aun no disponible";

  const fetchCuentas = async () => {
    try {
      const response = await axios.get('https://localhost:7199/api/Cuentas');
      setCuentas(response.data);
    } catch (error) {
      console.error('Error al obtener cuentas:', error);
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, []);

  const handleEditar = (id) => {
    // Mostrar snackbar en vez de alert
    setOpenSnackbar(true);
  };

  const handleEliminar = (id) => {
    // Mostrar snackbar en vez de confirm + delete
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>
        Lista de Cuentas
      </Typography>
      <br />
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Total de cuentas: {cuentas.length}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflow: 'auto' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID Usuario</TableCell>
              <TableCell>Saldo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cuentas.map((cuenta) => (
              <TableRow key={cuenta.id}>
                <TableCell>{cuenta.usuarioId}</TableCell>
                <TableCell>${cuenta.saldo.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleEditar(cuenta.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleEliminar(cuenta.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{
            width: '100%',
            backgroundColor: '#d32f2f', // rojo oscuro
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
          icon={null} 
        >
          {mensajeSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminCuentas;