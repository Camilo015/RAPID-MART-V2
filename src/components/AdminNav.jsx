import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminNav.css';

const AdminNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes agregar lógica adicional de limpieza si es necesario
    navigate('/'); // Redirige a la página principal
  };

  return (
    <nav className="admin-nav">
      <div className="admin-nav-content">
        <h1>Panel de Administración</h1>
        <button onClick={handleLogout} className="logout-button">
          Salir
        </button>
      </div>
    </nav>
  );
};

export default AdminNav; 