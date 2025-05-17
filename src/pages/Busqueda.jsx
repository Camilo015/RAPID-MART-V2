import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Secciones.css';

const Busqueda = () => {
  const { termino } = useParams();
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarProductos = async () => {
      try {
        setCargando(true);
        const response = await fetch(`http://localhost:5000/api/productos/buscar?q=${termino}`);
        if (!response.ok) {
          throw new Error('Error al buscar productos');
        }
        const data = await response.json();
        setResultados(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    buscarProductos();
  }, [termino]);

  if (cargando) {
    return (
      <div className="productos-container">
        <h1>Buscando...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="productos-container">
        <h1>Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className="productos-container">
      <h1>Resultados para: {termino}</h1>
      
      {resultados.length === 0 ? (
        <p>No se encontraron productos que coincidan con tu búsqueda.</p>
      ) : (
        <div className="productos-grid">
          {resultados.map((producto) => (
            <div key={producto.id} className="producto-card">
              <img src={producto.imagen} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p className="precio">${producto.precio}</p>
              <p className="descripcion">{producto.descripcion}</p>
              <button className="agregar-carrito">
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Busqueda; 