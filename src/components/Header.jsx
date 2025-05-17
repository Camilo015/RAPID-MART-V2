import React, { useEffect, useRef, useState } from 'react'; // Importar React, useEffect, useRef y useState
import '../styles/Secciones.css'; // Importar estilos específicos para el encabezado
import { usePerfil } from '../context/PerfilContext'; // Importar el contexto de perfil
import { getAuth, signOut } from 'firebase/auth';
import { appFirebase } from '../credenciales';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useCarrito } from '../context/CarritoContext';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

// Componente Header que representa la barra de navegación superior
const Header = () => {
  const { perfilMenuActivo, togglePerfilMenu, cerrarMenu } = usePerfil(); // Obtener estado y funciones del contexto de perfil
  const { agregarAlCarrito } = useCarrito();
  const menuRef = useRef(); // Referencia para el menú de perfil
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  // Efecto para cerrar el menú de perfil al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        cerrarMenu(); // Cerrar el menú si se hace clic fuera
      }
    };

    document.addEventListener('mousedown', handleClickOutside); // Agregar el evento de clic
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Limpiar el evento al desmontar
    };
  }, [cerrarMenu]);

  const mostrarTodosLosProductos = () => {
    const productos = document.querySelectorAll('.producto-card');
    const productosGrid = document.querySelector('.productos-grid');
    const paginacion = document.querySelector('.pagination');
    const categorias = document.querySelector('.categories');
    const titulo = document.querySelector('.productos-container h1');
    
    // Mostrar la cuadrícula de productos
    if (productosGrid) {
      productosGrid.style.display = 'grid';
    }
    
    // Mostrar la paginación
    if (paginacion) {
      paginacion.style.display = 'flex';
    }

    // Mostrar las categorías
    if (categorias) {
      categorias.style.display = 'grid';
    }

    // Mostrar el título
    if (titulo) {
      titulo.style.display = 'block';
    }
    
    // Mostrar todos los productos
    productos.forEach(producto => {
      producto.style.display = 'flex';
    });
    
    setIsSearching(false);
    setNoResults(false);
    
    // Eliminar el mensaje de no resultados si existe
    const mensajeNoResultados = document.querySelector('.no-results-message');
    if (mensajeNoResultados) {
      mensajeNoResultados.remove();
    }
  };

  const normalizarTexto = (texto) => {
    return texto.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^a-z0-9\s]/g, ""); // Eliminar caracteres especiales
  };

  const buscarCoincidencias = (texto, termino) => {
    const textoNormalizado = normalizarTexto(texto);
    const terminoNormalizado = normalizarTexto(termino);
    
    // Dividir el término de búsqueda en palabras
    const palabrasBusqueda = terminoNormalizado.split(/\s+/).filter(palabra => palabra.length > 0);
    
    // Verificar si todas las palabras de búsqueda están en el texto
    return palabrasBusqueda.every(palabra => textoNormalizado.includes(palabra));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const db = getFirestore();
      const productosRef = collection(db, 'productos');
      const q = query(productosRef);
      const querySnapshot = await getDocs(q);
      
      const productosEncontrados = [];
      const terminoBusqueda = normalizarTexto(searchTerm);

      querySnapshot.forEach((doc) => {
        const producto = { id: doc.id, ...doc.data() };
        const tituloNormalizado = normalizarTexto(producto.nombre);
        
        if (tituloNormalizado.includes(terminoBusqueda)) {
          productosEncontrados.push(producto);
        }
      });

      // Crear o actualizar el contenedor de resultados de búsqueda
      let resultadosContainer = document.querySelector('.resultados-busqueda');
      if (!resultadosContainer) {
        resultadosContainer = document.createElement('div');
        resultadosContainer.className = 'resultados-busqueda';
        document.body.appendChild(resultadosContainer);
      }

      if (productosEncontrados.length > 0) {
        resultadosContainer.innerHTML = `
          <div class="resultados-overlay">
            <div class="resultados-content">
              <div class="resultados-header">
                <h2>Resultados de búsqueda</h2>
                <button class="cerrar-resultados">×</button>
              </div>
              <div class="resultados-grid">
                ${productosEncontrados.map(producto => `
                  <div class="producto-card">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p class="descripcion">${producto.descripcion || ''}</p>
                    ${producto.enPromocion ? `
                      <p class="precio-original">$${producto.precioOriginal}</p>
                      <div class="descuento-badge">-${producto.descuento}%</div>
                    ` : ''}
                    <p class="precio">$${producto.precio}</p>
                    <button class="agregar-carrito" data-producto-id="${producto.id}">
                      Agregar al Carrito
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;

        // Agregar estilos dinámicamente
        const style = document.createElement('style');
        style.textContent = `
          .resultados-busqueda {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
          }
          .resultados-overlay {
            background-color: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 100px;
            overflow-y: auto;
          }
          .resultados-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 1200px;
            max-height: 80vh;
            overflow-y: auto;
          }
          .resultados-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .resultados-header h2 {
            color: #702929;
            margin: 0;
          }
          .cerrar-resultados {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
          }
          .resultados-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
        `;
        document.head.appendChild(style);

        // Agregar eventos para los botones de agregar al carrito
        const botonesAgregar = resultadosContainer.querySelectorAll('.agregar-carrito');
        botonesAgregar.forEach(boton => {
          boton.addEventListener('click', () => {
            const productoId = boton.getAttribute('data-producto-id');
            const producto = productosEncontrados.find(p => p.id === productoId);
            if (producto) {
              agregarAlCarrito(producto);
              // Mostrar mensaje de éxito
              const mensaje = document.createElement('div');
              mensaje.className = 'mensaje-agregado';
              mensaje.textContent = 'Producto agregado al carrito';
              mensaje.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 1001;
                animation: fadeOut 3s forwards;
              `;
              document.body.appendChild(mensaje);
              setTimeout(() => mensaje.remove(), 3000);
            }
          });
        });

        // Agregar evento para cerrar los resultados
        const cerrarBtn = resultadosContainer.querySelector('.cerrar-resultados');
        cerrarBtn.addEventListener('click', () => {
          resultadosContainer.remove();
        });

        // Cerrar al hacer clic fuera del contenido
        resultadosContainer.addEventListener('click', (e) => {
          if (e.target === resultadosContainer) {
            resultadosContainer.remove();
          }
        });
      } else {
        resultadosContainer.innerHTML = `
          <div class="resultados-overlay">
            <div class="resultados-content">
              <div class="resultados-header">
                <h2>No se encontraron productos</h2>
                <button class="cerrar-resultados">×</button>
              </div>
              <p style="text-align: center; color: #702929; font-size: 1.2rem;">
                No se encontraron productos que coincidan con "${searchTerm}"
              </p>
            </div>
          </div>
        `;

        // Agregar evento para cerrar los resultados
        const cerrarBtn = resultadosContainer.querySelector('.cerrar-resultados');
        cerrarBtn.addEventListener('click', () => {
          resultadosContainer.remove();
        });

        // Cerrar al hacer clic fuera del contenido
        resultadosContainer.addEventListener('click', (e) => {
          if (e.target === resultadosContainer) {
            resultadosContainer.remove();
          }
        });
      }
    } catch (error) {
      console.error('Error al buscar productos:', error);
      alert('Error al buscar productos. Por favor, intente nuevamente.');
    }
  };

  const menuItems = [
    { name: 'Inicio', path: '/Inicio' },
    { name: 'Categorías', path: '/Categorias' },
    { name: 'Promociones', path: '/Promociones' },
    { name: 'Historial de Pedidos', path: '/HistorialPedidos' },
    { name: 'Soporte', path: '/Soporte' }
  ];

  return (
    <>
      <header className="header"> 
        <div className="logo"> 
          <img src="../LOGO SENA.png" width="200" height="70" alt="Logo" /> 
        </div>
        <nav ref={menuRef}> {/* Contenedor de navegación */}
          <button className="perfil" onClick={togglePerfilMenu}>PERFIL</button> {/* Botón para mostrar/ocultar el menú de perfil */}
          <div className={`perfil-dropdown ${perfilMenuActivo ? 'active' : ''}`}> {/* Menú desplegable de perfil */}
            <ul>
              <li><a href="/perfil">Detalles de Cuenta</a></li>
              <li><a href="/" onClick={() => signOut(auth)}>Cerrar sesión</a></li> 
            </ul>
          </div>
        </nav>
        <div className="search-container"> 
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="¿Qué estás buscando?" 
              className="search-box"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /> 
            <button type="submit" className="search-btn">🔍</button> 
          </form>
          {isSearching && (
            <button 
              onClick={mostrarTodosLosProductos}
              className="show-all-btn"
              style={{
                marginLeft: '10px',
                padding: '8px 12px',
                backgroundColor: '#702929',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Mostrar todos
            </button>
          )}
        </div>
      </header>

      <nav className="navbar"> 
        <ul className="menu"> 
          {menuItems.map((item, index) => (
            <li key={index}><a href={item.path}>{item.name}</a></li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Header; 