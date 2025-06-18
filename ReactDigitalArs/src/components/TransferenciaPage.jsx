import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button 
} from '@mui/material';

const TransferenciaPage = () => {
  const [emailDestino, setEmailDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const cuentaOrigenId = localStorage.getItem("cuentaId");
  const token = localStorage.getItem("token");

  const handleTransferir = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!emailDestino || !monto) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const responseTrans = await fetch('https://localhost:7199/api/Transacciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          monto: Number(monto),
          descripcion: "Transferencia realizada",
          tipoTransaccion: "transferencia",
          cuentaOrigenId: Number(cuentaOrigenId),
          emailDestino: emailDestino.trim()
        })
      });

      if (!responseTrans.ok) {
        const errorText = await responseTrans.text(); // leer como texto plano
        const errorMessage = errorText.toLowerCase();

        if (errorMessage.includes("no registrado") || errorMessage.includes("no existe")) {
          throw new Error("Ingresa un email válido");
        }

        throw new Error(errorText || "Error al realizar la transferencia.");
      }

      setMensaje("Transferencia realizada con éxito.");
      setEmailDestino('');
      setMonto('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(135deg, #6F04D9, #1B0273)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Box
        sx={{
          bgcolor: '#fff',
          p: 5,
          borderRadius: 2,
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Box
          component="img"
          src="/logo_DigitalArs_Azul.svg"
          alt="Logo DigitalArs"
          sx={{ display: 'block', maxWidth: 280, height: 60, mb: 4, mx: 'auto' }}
        />

        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: '#333',
          }}
        >
          Realizar Transferencia
        </Typography>

        <Box
          component="form"
          onSubmit={handleTransferir}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Email del destinatario"
            type="email"
            value={emailDestino}
            onChange={(e) => setEmailDestino(e.target.value)}
            required
            fullWidth
            sx={{
              '& input': { textAlign: 'center' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />

          <TextField
            label="Monto a transferir"
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
            inputProps={{ min: 100 }}
            fullWidth
            sx={{
              '& input': { textAlign: 'center' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#3866F2',
              fontWeight: 600,
              py: 1.25,
              fontSize: '1rem',
              borderRadius: 1,
              '&:hover': {
                bgcolor: '#0597F2',
              },
            }}
          >
            Transferir
          </Button>
        </Box>

        {mensaje && (
          <Typography
            sx={{
              mt: 3,
              color: 'green',
              fontWeight: 600,
            }}
          >
            {mensaje}
          </Typography>
        )}

        {error && (
          <Typography
            sx={{
              mt: 3,
              color: 'red',
              fontWeight: 600,
            }}
          >
            {error}
          </Typography>
        )}

        <Button
          onClick={() => navigate('/usuario')}
          variant="outlined"
          sx={{
            mt: 4,
            bgcolor: '#ccc',
            color: '#333',
            fontWeight: 600,
            py: 1,
            borderRadius: 1,
            width: '100%',
            '&:hover': {
              bgcolor: '#bbb',
            },
          }}
        >
          Volver
        </Button>
      </Box>
    </Box>
  );
};

export default TransferenciaPage;