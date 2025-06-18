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

const AdminTransacciones = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchTransacciones = async () => {
    try {
      const response = await axios.get('https://localhost:7199/api/Transacciones');
      setTransacciones(response.data);
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
    }
  };

  useEffect(() => {
    fetchTransacciones();
  }, []);

  const handleEditar = (id) => {
    setOpenSnackbar(true);
  };

  const handleEliminar = async (id) => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>
        Lista de Transacciones
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Total: {transacciones.length}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflow: 'auto' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transacciones.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.transaccionId}</TableCell>
                <TableCell>{new Date(tx.fecha).toLocaleString()}</TableCell>
                <TableCell>${tx.monto.toFixed(2)}</TableCell>
                <TableCell>{tx.descripcion}</TableCell>
                <TableCell>{tx.tipoTransaccion}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mr: 1 }}
                    color="primary"
                    onClick={() => handleEditar(tx.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleEliminar(tx.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '&.MuiSnackbar-root': {
            top: '16px !important',
            left: '50% !important',
            transform: 'translateX(-50%) !important',
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{
            width: '100%',
            backgroundColor: '#d32f2f',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
          icon={null}
        >
          Funcionalidad aun no disponible
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminTransacciones;