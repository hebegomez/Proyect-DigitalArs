import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import AdminPage from './components/AdminPage.jsx';
import UsuarioPage from './components/UsuarioPage.jsx';
import TransferenciaPage from './components/TransferenciaPage.jsx';
import AdminUsuarios from './components/AdminUsuarios.jsx';
import AdminCuentas from './components/AdminCuentas.jsx';
import AdminTransacciones from './components/AdminTransacciones.jsx';
import Register from './components/Registro.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/" element={<Login />} />
      <Route path="/usuario" element={<UsuarioPage />} />
      <Route path="/transferencia" element={<TransferenciaPage />} />

      <Route path="/admin" element={<AdminPage />}>
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="cuentas" element={<AdminCuentas />} />
        <Route path="transacciones" element={<AdminTransacciones />} />
      </Route>
    </Routes>
  );
}

export default App;