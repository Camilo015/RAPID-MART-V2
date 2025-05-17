import React, { useState, useEffect } from 'react';
import { getProductos, agregarProducto, actualizarProducto, eliminarProducto } from '../services/productosService';
import { getTodosLosPedidos, actualizarEstadoPedido } from '../services/pedidosService';
import AdminNav from '../components/AdminNav';
import '../styles/AdminDashboard.css';

const CATEGORIAS = [
  'Lácteos',
  'Abarrotes',
  'Aseo',
  'Droguería',
  'Frutas y Verduras',
  'Licores',
  'Mascotas',
  'Panadería'
];

const ESTADOS_PEDIDO = ['pendiente', 'enviado', 'entregado', 'cancelado'];

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    descripcion: '',
    categoria: '',
    imagen: '',
    enPromocion: false,
    precioOriginal: '',
    descuento: ''
  });
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [filtroEstadoPedido, setFiltroEstadoPedido] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' o 'pedidos'

  // Cargar productos y pedidos
  const cargarDatos = async () => {
    try {
      const [listaProductos, listaPedidos] = await Promise.all([
        getProductos(),
        getTodosLosPedidos()
      ]);
      setProductos(listaProductos);
      setPedidos(listaPedidos);
    } catch (error) {
      mostrarMensaje('Error al cargar datos', 'error');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Mostrar mensajes
  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };

  // Añadir nuevo producto
  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    try {
      // Si el producto está en promoción, calcular el precio con descuento
      if (nuevoProducto.enPromocion) {
        const precioOriginal = parseFloat(nuevoProducto.precioOriginal);
        const descuento = parseFloat(nuevoProducto.descuento);
        const precioConDescuento = precioOriginal * (1 - descuento / 100);
        nuevoProducto.precio = precioConDescuento;
      }

      await agregarProducto(nuevoProducto);
      setNuevoProducto({
        nombre: '',
        precio: '',
        stock: '',
        descripcion: '',
        categoria: '',
        imagen: '',
        enPromocion: false,
        precioOriginal: '',
        descuento: ''
      });
      mostrarMensaje('Producto agregado exitosamente', 'exito');
      cargarDatos();
    } catch (error) {
      mostrarMensaje('Error al agregar producto', 'error');
    }
  };

  // Actualizar producto
  const handleActualizarProducto = async (e) => {
    e.preventDefault();
    try {
      // Si el producto está en promoción, calcular el precio con descuento
      if (editandoProducto.enPromocion) {
        const precioOriginal = parseFloat(editandoProducto.precioOriginal);
        const descuento = parseFloat(editandoProducto.descuento);
        const precioConDescuento = precioOriginal * (1 - descuento / 100);
        editandoProducto.precio = precioConDescuento;
      }

      await actualizarProducto(editandoProducto.id, editandoProducto);
      setEditandoProducto(null);
      mostrarMensaje('Producto actualizado exitosamente', 'exito');
      cargarDatos();
    } catch (error) {
      mostrarMensaje('Error al actualizar producto', 'error');
    }
  };

  // Eliminar producto
  const handleEliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await eliminarProducto(id);
        mostrarMensaje('Producto eliminado exitosamente', 'exito');
        cargarDatos();
      } catch (error) {
        mostrarMensaje('Error al eliminar producto', 'error');
      }
    }
  };

  // Filtrar productos por categoría
  const productosFiltrados = categoriaSeleccionada
    ? productos.filter(producto => producto.categoria === categoriaSeleccionada)
    : productos;

  // Manejar actualización de estado de pedido
  const handleActualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(pedidoId, nuevoEstado);
      await cargarDatos();
      mostrarMensaje('Estado del pedido actualizado', 'exito');
    } catch (error) {
      mostrarMensaje('Error al actualizar estado del pedido', 'error');
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrar pedidos por estado
  const pedidosFiltrados = filtroEstadoPedido
    ? pedidos.filter(pedido => pedido.estado.toLowerCase() === filtroEstadoPedido.toLowerCase())
    : pedidos;

  return (
    <div className="admin-dashboard-container">
      <AdminNav />
      
      <div className="admin-dashboard">
        {mensaje.texto && (
          <div className={`mensaje ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            Gestión de Productos
          </button>
          <button 
            className={`tab-button ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedidos')}
          >
            Seguimiento de Pedidos
          </button>
        </div>

        {activeTab === 'productos' ? (
          <>
            {/* Filtro de categorías */}
            <div className="filtro-categorias">
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {CATEGORIAS.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            {/* Formulario de producto */}
            <div className="formulario-producto">
              <h2>{editandoProducto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <form onSubmit={editandoProducto ? handleActualizarProducto : handleAgregarProducto}>
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={editandoProducto ? editandoProducto.nombre : nuevoProducto.nombre}
                  onChange={(e) => editandoProducto
                    ? setEditandoProducto({...editandoProducto, nombre: e.target.value})
                    : setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={editandoProducto ? editandoProducto.precio : nuevoProducto.precio}
                  onChange={(e) => editandoProducto
                    ? setEditandoProducto({...editandoProducto, precio: e.target.value})
                    : setNuevoProducto({...nuevoProducto, precio: e.target.value})}
                  required
                  disabled={editandoProducto?.enPromocion || nuevoProducto.enPromocion}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={editandoProducto ? editandoProducto.stock : nuevoProducto.stock}
                  onChange={(e) => editandoProducto
                    ? setEditandoProducto({...editandoProducto, stock: e.target.value})
                    : setNuevoProducto({...nuevoProducto, stock: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Descripción"
                  value={editandoProducto ? editandoProducto.descripcion : nuevoProducto.descripcion}
                  onChange={(e) => editandoProducto
                    ? setEditandoProducto({...editandoProducto, descripcion: e.target.value})
                    : setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
                  required
                />
                <select
                  value={editandoProducto ? editandoProducto.categoria : nuevoProducto.categoria}
                  onChange={(e) => editandoProducto
                    ? setEditandoProducto({...editandoProducto, categoria: e.target.value})
                    : setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {CATEGORIAS.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="URL de la imagen"
                  value={editandoProducto ? editandoProducto.imagen : nuevoProducto.imagen}
                  onChange={(e) => editandoProducto
                    ? setEditandoProducto({...editandoProducto, imagen: e.target.value})
                    : setNuevoProducto({...nuevoProducto, imagen: e.target.value})}
                  required
                />
                
                {/* Campos de promoción */}
                <div className="promocion-fields">
                  <label>
                    <input
                      type="checkbox"
                      checked={editandoProducto ? editandoProducto.enPromocion : nuevoProducto.enPromocion}
                      onChange={(e) => editandoProducto
                        ? setEditandoProducto({...editandoProducto, enPromocion: e.target.checked})
                        : setNuevoProducto({...nuevoProducto, enPromocion: e.target.checked})}
                    />
                    Producto en promoción
                  </label>
                  
                  {(editandoProducto?.enPromocion || nuevoProducto.enPromocion) && (
                    <>
                      <input
                        type="number"
                        placeholder="Precio original"
                        value={editandoProducto ? editandoProducto.precioOriginal : nuevoProducto.precioOriginal}
                        onChange={(e) => editandoProducto
                          ? setEditandoProducto({...editandoProducto, precioOriginal: e.target.value})
                          : setNuevoProducto({...nuevoProducto, precioOriginal: e.target.value})}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Porcentaje de descuento"
                        value={editandoProducto ? editandoProducto.descuento : nuevoProducto.descuento}
                        onChange={(e) => editandoProducto
                          ? setEditandoProducto({...editandoProducto, descuento: e.target.value})
                          : setNuevoProducto({...nuevoProducto, descuento: e.target.value})}
                        required
                        min="0"
                        max="100"
                      />
                    </>
                  )}
                </div>

                <button type="submit">
                  {editandoProducto ? 'Actualizar Producto' : 'Agregar Producto'}
                </button>
                {editandoProducto && (
                  <button type="button" onClick={() => setEditandoProducto(null)}>
                    Cancelar Edición
                  </button>
                )}
              </form>
            </div>

            {/* Lista de productos */}
            <div className="lista-productos">
              <h2>Productos</h2>
              <table>
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Promoción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto) => (
                    <tr key={producto.id}>
                      <td>
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>{producto.nombre}</td>
                      <td>
                        {producto.enPromocion ? (
                          <>
                            <span style={{ textDecoration: 'line-through' }}>${producto.precioOriginal}</span>
                            <br />
                            <span style={{ color: 'red' }}>${producto.precio}</span>
                            <br />
                            <span style={{ color: 'green' }}>-{producto.descuento}%</span>
                          </>
                        ) : (
                          `$${producto.precio}`
                        )}
                      </td>
                      <td>{producto.stock}</td>
                      <td>{producto.categoria}</td>
                      <td>{producto.enPromocion ? 'Sí' : 'No'}</td>
                      <td>
                        <button onClick={() => setEditandoProducto(producto)}>
                          Editar
                        </button>
                        <button onClick={() => handleEliminarProducto(producto.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          // Nueva sección de seguimiento de pedidos
          <div className="pedidos-seccion">
            <div className="filtros">
              <select
                value={filtroEstadoPedido}
                onChange={(e) => setFiltroEstadoPedido(e.target.value)}
                className="filtro-estado"
              >
                <option value="">Todos los estados</option>
                {ESTADOS_PEDIDO.map(estado => (
                  <option key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="pedidos-lista">
              {pedidosFiltrados.map(pedido => (
                <div key={pedido.id} className="pedido-card">
                  <div className="pedido-header">
                    <div className="pedido-info">
                      <h3>Pedido #{pedido.id.slice(-6)}</h3>
                      <p className="pedido-fecha">
                        Fecha: {formatearFecha(pedido.fechaCreacion)}
                      </p>
                    </div>
                    <div className="pedido-estado">
                      <span className={`estado-badge ${pedido.estado.toLowerCase()}`}>
                        {pedido.estado}
                      </span>
                    </div>
                  </div>

                  <div className="pedido-detalles">
                    <div className="cliente-info">
                      <h4>Cliente</h4>
                      <p>ID: {pedido.usuarioId}</p>
                      <p>Dirección: {pedido.direccion}</p>
                    </div>

                    <div className="productos-info">
                      <h4>Productos</h4>
                      <ul>
                        {pedido.items.map((item, index) => (
                          <li key={index}>
                            {item.nombre} x {item.cantidad} - ${item.precio}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pedido-total">
                      <h4>Total</h4>
                      <p>${pedido.total}</p>
                    </div>
                  </div>

                  <div className="pedido-acciones">
                    <select
                      value={pedido.estado}
                      onChange={(e) => handleActualizarEstadoPedido(pedido.id, e.target.value)}
                      className="estado-select"
                    >
                      {ESTADOS_PEDIDO.map(estado => (
                        <option key={estado} value={estado}>
                          {estado.charAt(0).toUpperCase() + estado.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pedido-fechas">
                    {pedido.fechaEnvio && (
                      <p>Enviado: {formatearFecha(pedido.fechaEnvio)}</p>
                    )}
                    {pedido.fechaEntrega && (
                      <p>Entregado: {formatearFecha(pedido.fechaEntrega)}</p>
                    )}
                  </div>
                </div>
              ))}

              {pedidosFiltrados.length === 0 && (
                <div className="no-pedidos">
                  No hay pedidos {filtroEstadoPedido ? `en estado "${filtroEstadoPedido}"` : ''}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 