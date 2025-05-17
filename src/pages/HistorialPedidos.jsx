import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Header';
import { getPedidosUsuario, cancelarPedido } from '../services/pedidosService';
import '../styles/HistorialPedidos.css';
import CarritoFlotante from '../components/CarritoFlotante';
import Carrito from '../components/Carrito';
import Alerta from '../components/Alerta';

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [pedidoACancelar, setPedidoACancelar] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const cargarPedidos = async (user) => {
    try {
      setLoading(true);
      setError('');
      const pedidosData = await getPedidosUsuario(user.uid);
      setPedidos(pedidosData);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setError(error.message || 'Error al cargar el historial de pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        cargarPedidos(user);
      } else {
        setError('No hay usuario autenticado');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCancelarPedido = async (pedidoId) => {
    try {
      await cancelarPedido(pedidoId);
      setPedidos(pedidos.filter(pedido => pedido.id !== pedidoId));
      setMensaje('Pedido cancelado exitosamente');
      setPedidoACancelar(null);
    } catch (error) {
      setMensaje('Error al cancelar el pedido: ' + error.message);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return '#ffc107';
      case 'en_proceso':
        return '#17a2b8';
      case 'enviado':
        return '#007bff';
      case 'entregado':
        return '#28a745';
      case 'cancelado':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    
    // Si es un Timestamp de Firestore
    if (fecha && typeof fecha.toDate === 'function') {
      fecha = fecha.toDate();
    }
    
    // Si ya es un objeto Date o un string de fecha
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };

  const formatearPrecio = (precio) => {
    if (!precio) return '$0';
    try {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(precio);
    } catch (error) {
      console.error('Error al formatear precio:', error);
      return '$0';
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className="historial-container">
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Cargando historial de pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Header />
        <div className="historial-container">
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button 
              className="btn-reintentar"
              onClick={() => cargarPedidos(auth.currentUser)}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <Alerta mensaje={mensaje} onClose={() => setMensaje('')} />
      <CarritoFlotante />
      <Carrito />

      <div className="historial-container">
        <h1>Historial de Pedidos</h1>
        
        {pedidos.length === 0 ? (
          <div className="no-pedidos">
            <i className="fas fa-shopping-bag"></i>
            <p>No tienes pedidos realizados</p>
          </div>
        ) : (
          <div className="pedidos-list">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="pedido-card">
                <div className="pedido-header">
                  <div className="pedido-info">
                    <h3>Pedido #{pedido.id.slice(-6)}</h3>
                    <p className="pedido-fecha">{formatearFecha(pedido.fechaCreacion)}</p>
                  </div>
                  <div className="pedido-estado">
                    <span 
                      className={`estado-badge ${pedido.estado?.toLowerCase()}`}
                      style={{ backgroundColor: getEstadoColor(pedido.estado) }}
                    >
                      {pedido.estado}
                    </span>
                    {pedido.estado?.toLowerCase() === 'pendiente' && (
                      <button 
                        className="btn-cancelar"
                        onClick={() => setPedidoACancelar(pedido)}
                      >
                        Cancelar Pedido
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="pedido-info">
                  <p><strong>Total:</strong> {formatearPrecio(pedido.total)}</p>
                  <p><strong>Dirección:</strong> {pedido.direccion || 'No especificada'}</p>
                  <p><strong>Método de pago:</strong> {pedido.metodoPago || 'No especificado'}</p>
                </div>

                <div className="pedido-items">
                  <h4>Productos:</h4>
                  <ul>
                    {pedido.items?.map((item, index) => (
                      <li key={index} className="pedido-item">
                        <div className="item-imagen">
                          <img src={item.imagen} alt={item.nombre} />
                        </div>
                        <div className="item-detalles">
                          <span className="item-nombre">{item.nombre}</span>
                          <span className="item-cantidad">x{item.cantidad}</span>
                          <span className="item-precio">{formatearPrecio(item.precio * item.cantidad)}</span>
                        </div>
                      </li>
                    )) || <li>No hay productos en este pedido</li>}
                  </ul>
                </div>

                <div className="pedido-timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Pedido Realizado</h4>
                      <p>{formatearFecha(pedido.fechaCreacion)}</p>
                    </div>
                  </div>
                  {pedido.estado !== 'pendiente' && (
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>En Proceso</h4>
                        <p>{formatearFecha(pedido.fechaActualizacion)}</p>
                      </div>
                    </div>
                  )}
                  {pedido.estado === 'enviado' && (
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>Enviado</h4>
                        <p>{formatearFecha(pedido.fechaEnvio)}</p>
                      </div>
                    </div>
                  )}
                  {pedido.estado === 'entregado' && (
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>Entregado</h4>
                        <p>{formatearFecha(pedido.fechaEntrega)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pedidoACancelar && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Confirmar Cancelación</h3>
            <div className="modal-content">
              <p>¿Estás seguro de que deseas cancelar este pedido?</p>
              <p>Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancelar"
                onClick={() => setPedidoACancelar(null)}
              >
                Volver
              </button>
              <button 
                className="btn-confirmar"
                onClick={() => handleCancelarPedido(pedidoACancelar.id)}
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialPedidos; 