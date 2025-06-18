import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('https://localhost:7199/api/auth/loginUsuario', {
        username: username.trim(),
        password: password.trim(),
      });

      const { token, nombre, usuarioId, rol, cuentaId, saldo } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('usuarioId', usuarioId);
      localStorage.setItem('rol', rol);
      localStorage.setItem('cuentaId', cuentaId);
      localStorage.setItem('saldo', saldo);

      setSuccess('Inicio de sesión exitoso');

      // Espera breve para mostrar el mensaje antes de navegar
      setTimeout(() => {
        if (rol === 'Admin') {
          navigate('/admin/usuarios');
        } else {
          navigate('/usuario');
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión, revisa los datos');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src="/logo_DigitalArs.svg" alt="Logo DigitalArs" className="login-left-logo" />
        <br />
        <br />
        <Typography variant="body2" component="h1" color="white">
          ¡Bienvenid@!
        </Typography>
        <Typography variant="body1" color="white" sx={{ lineHeight: 1.5 }}>
          Te ayudamos a manejar tu dinero de forma simple y segura.
          <br />
          Iniciá sesión y empezá a disfrutar de una experiencia financiera sin complicaciones.
        </Typography>
      </div>

      <div className="login-right">
        <Box className="login-card" component="form" onSubmit={handleLogin} noValidate sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4, color: '#333' }}>
            Iniciar Sesión
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

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

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Ingresa
            </Button>
            <Button type="button" variant="outlined" color="primary" fullWidth onClick={() => navigate('/registro')}>
              Regístrate
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Login;