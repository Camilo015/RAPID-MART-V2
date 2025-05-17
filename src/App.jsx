import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Productos from './pages/Productos';
import Promociones from './pages/Promociones';
import Servicios from './pages/Servicios';
import DetalleProducto from './pages/DetalleProducto';
import HistorialPedidos from './pages/HistorialPedidos';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <CarritoProvider>
      <Router>
        <div className="app">
          <Header />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/promociones" element={<Promociones />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />

            {/* Rutas protegidas */}
            <Route 
              path="/historial-pedidos" 
              element={
                <ProtectedRoute>
                  <HistorialPedidos />
                </ProtectedRoute>
              } 
            />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </CarritoProvider>
  );
}

export default App; 