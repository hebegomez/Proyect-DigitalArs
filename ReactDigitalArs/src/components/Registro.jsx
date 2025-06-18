import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import './Login.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validarEmail = (email) => {
    // Valida que el email tenga formato nombre@dominio.ext
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validarEmail(email.trim())) {
      setError('Por favor ingresá un email válido.');
      return;
    }

    try {
  await axios.post('https://localhost:7199/api/auth/registerUsuario', {
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    dni: dni.trim(),
    email: email.trim(),
    contraseña: contraseña.trim(),
  });

  setSuccess('Registro exitoso. Iniciá sesión.');
  
  // Redirigir después de 1 segundo
  setTimeout(() => {
    navigate('/login');
  }, 1000);
} catch (err) {
  console.error(err);
  setError('Error al registrarse. Verificá los datos.');
}
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src="/logo_DigitalArs.svg" alt="Logo DigitalArs" className="login-left-logo" />
        <br />
        <br />
        <Typography variant="body2" component="h1" color="white">
          ¡Crea tu cuenta!
        </Typography>
        <Typography variant="body1" color="white" sx={{ lineHeight: 1.5 }}>
          Unite a DigitalArs y empezá a manejar tu dinero con total confianza.
        </Typography>
      </div>

      <div className="login-right">
        <Box className="login-card" component="form" onSubmit={handleRegister} noValidate sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4, color: '#333' }}>
            Registro
          </Typography>

          <TextField
            label="Nombre/s"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <TextField
            label="Apellido/s"
            variant="outlined"
            fullWidth
            margin="normal"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={email && !validarEmail(email)}
            helperText={email && !validarEmail(email) ? 'Email no válido' : ''}
          />
          
          <TextField
            label="DNI"
            variant="outlined"
            fullWidth
            margin="normal"
            value={dni}
            onChange={(e) => {
              const newValue = e.target.value;
              if (/^\d*$/.test(newValue)) {
                setDni(newValue);
              }
            }}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 9,
            }}
            required
          />

          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Crear cuenta
            </Button>
            <Button variant="outlined" color="primary" fullWidth onClick={() => navigate('/login')}>
              Volver
            </Button>
          </Box>

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
              {error}
            </Typography>
          )}

          {success && (
            <Typography variant="body2" color="success.main" sx={{ mt: 2, fontWeight: 'bold' }}>
              {success}
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
};

export default Register;