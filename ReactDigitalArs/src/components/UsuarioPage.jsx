import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Asegúrate de que el path sea correcto
import './UsuarioPage.css';

const UsuarioPage = () => {
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState(null);
  const [usuario, setUsuario] = useState({ nombre: '', apellido: '' });
  const [transacciones, setTransacciones] = useState([]);

  const cuentaId = localStorage.getItem('cuentaId') || '';
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        if (!cuentaId) throw new Error('Cuenta no encontrada');

        const responseCuenta = await fetch(`https://localhost:7199/api/Cuentas/${cuentaId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!responseCuenta.ok) throw new Error('Error al obtener la cuenta');
        const cuentaData = await responseCuenta.json();
        setSaldo(cuentaData.saldo);

        const usuarioId = cuentaData.usuarioId;
        const responseUsuario = await fetch(`https://localhost:7199/api/Usuarios/${usuarioId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!responseUsuario.ok) throw new Error('Error al obtener usuario');
        const usuarioData = await responseUsuario.json();
        setUsuario({ nombre: usuarioData.nombre, apellido: usuarioData.apellido });

        const responseTransacciones = await fetch(`https://localhost:7199/api/Transacciones/porCuenta/${cuentaId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!responseTransacciones.ok) throw new Error('Error al obtener transacciones');
        const transaccionesData = await responseTransacciones.json();
        setTransacciones(transaccionesData);
      } catch (error) {
        console.error(error);
        setSaldo('Error al cargar saldo');
        setUsuario({ nombre: '', apellido: '' });
        setTransacciones([]);
      }
    };

    obtenerDatos();
  }, [cuentaId, token]);

  const handleTransferencia = () => navigate('/transferencia');
  const handleDepositar = () => alert('Funcionalidad de depósito próximamente');
  const handleRetirar = () => alert('Funcionalidad de retiro próximamente');
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        onLogout={handleLogout}
        onTransferencias={handleTransferencia}
        onDepositar={handleDepositar}
        onRetirar={handleRetirar}
        nombreUsuario={`${usuario.nombre} ${usuario.apellido}`}
      />

      <main style={{ flexGrow: 1, padding: '2rem', overflowY: 'auto', height: '100vh' }}>
        <header className="wallet-header">
          <h1>Mi Cuenta</h1>
        </header>

        <section className="wallet-balance">
          <p>Saldo</p>
          <h2>{saldo !== null ? `$${saldo}` : 'Cargando...'}</h2>
        </section>

        <section className="wallet-transactions">
          <h3>Transacciones Recientes</h3>
          {transacciones.length === 0 ? (
            <p>No hay transacciones para mostrar.</p>
          ) : (
            <ul>
              {transacciones.map(t => {
                const esSalida = t.cuentaOrigenId === Number(cuentaId);
                const nombreDestino = `${t.nombreDestino ?? ''} ${t.apellidoDestino ?? ''}`.trim();
                const nombreOrigen = `${t.nombreOrigen ?? ''} ${t.apellidoOrigen ?? ''}`.trim();

                let descripcion = '';
                if (t.tipoTransaccion === 'transferencia') {
                  descripcion = esSalida
                    ? `Transferencia a ${nombreDestino || 'desconocido'}`
                    : `Recibido de ${nombreOrigen || 'desconocido'}`;
                } else if (t.tipoTransaccion === 'deposito') {
                  descripcion = 'Depósito';
                } else if (t.tipoTransaccion === 'retiro') {
                  descripcion = 'Retiro';
                }

                return (
                  <li key={t.transaccionId}>
                    <span>{descripcion}</span>
                    <span style={{ color: esSalida ? 'red' : 'green' }}>
                      {esSalida ? '-' : '+'}${t.monto.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default UsuarioPage;