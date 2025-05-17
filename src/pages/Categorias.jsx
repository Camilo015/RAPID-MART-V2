import React, { useState } from "react"; // Importar React y useState para manejar el estado
import "../styles/Categorias.css"; // Importar estilos específicos para la página de categorías
import "../styles/Secciones.css"; // Importar estilos generales para secciones
import lacteos from "../images/ICONOS PAGINA CLIENTE/LACTEOS.png"; // Importar icono de lácteos
import frutasVerduras from "../images/ICONOS PAGINA CLIENTE/FRUTAS Y VERDURAS.png"; // Importar icono de frutas y verduras
import licores from "../images/ICONOS PAGINA CLIENTE/LICORES.png"; // Importar icono de licores
import mascotas from "../images/ICONOS PAGINA CLIENTE/MASCOTAS.png"; // Importar icono de mascotas
import drogueria from "../images/ICONOS PAGINA CLIENTE/MEDICAMENTOS.png"; // Importar icono de droguería
import aseo from "../images/ICONOS PAGINA CLIENTE/ASEO.png"; // Importar icono de aseo
import panaderia from "../images/ICONOS PAGINA CLIENTE/PANADERIA.png"; // Importar icono de panadería
import abarrotes from "../images/ICONOS PAGINA CLIENTE/ABARROTES.png"; // Importar icono de abarrotes
import Carrito from "../components/Carrito"; // Importar componente Carrito
import CarritoFlotante from "../components/CarritoFlotante"; // Importar componente Carrito Flotante
import Header from "../components/Header"; // Importar componente Header

// Componente principal de Categorías
const Categorias = () => {
  const [carrito, setCarrito] = useState([]); // Estado para almacenar los productos en el carrito
  const [mostrarCarrito, setMostrarCarrito] = useState(false); // Estado para controlar la visibilidad del carrito

  // Función para actualizar el carrito con nuevos items
  const actualizarCarrito = (nuevosItems) => {
    setCarrito(nuevosItems);
  };

  // Calcular la cantidad total de productos en el carrito
  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

  // Definición de categorías disponibles
  const categories = [
    { name: "LÁCTEOS", img: lacteos, desc: "Leche, yogurt, quesos y más", link: "Lacteos" },
    { name: "FRUTAS Y VERDURAS", img: frutasVerduras, desc: "Productos frescos y saludables", link: "FyV" },
    { name: "LICORES", img: licores, desc: "Vinos, cervezas y licores", link: "Licores" },
    { name: "MASCOTAS", img: mascotas, desc: "Alimentos y accesorios para mascotas", link: "Mascotas" },
    { name: "DROGUERÍA", img: drogueria, desc: "Medicamentos y productos de salud", link: "Drogueria" },
    { name: "ASEO", img: aseo, desc: "Productos de limpieza y cuidado del hogar", link: "Aseo" },
    { name: "PANADERÍA", img: panaderia, desc: "Pan fresco y productos horneados", link: "Panaderia" },
    { name: "ABARROTES", img: abarrotes, desc: "Productos básicos y despensa", link: "Abarrotes" }
  ];

  return (
    <div className="app-container">
      <Header /> 
      
      <main className="productos-container">
        <h1>Categorías</h1> 
        <div className="categories">
          {categories.map((category, index) => ( 
            <div key={index} className="category-item" onClick={() => window.location.href = category.link}>
              <img src={category.img} alt={category.name} className="category-icon" /> 
              <div className="category-text">{category.name}</div> 
            </div>
          ))}
        </div>
      </main>

      <CarritoFlotante 
        cantidad={cantidadTotal} // Pasar la cantidad total de productos al carrito flotante
        onClick={() => setMostrarCarrito(true)} // Manejar clic para mostrar el carrito
      />

      <Carrito
        visible={mostrarCarrito} // Controlar la visibilidad del carrito
        onClose={() => setMostrarCarrito(false)} // Manejar el cierre del carrito
        productos={carrito} // Pasar los productos al carrito
        onUpdateCart={actualizarCarrito} // Pasar la función para actualizar el carrito
      />
    </div>
  );
};

export default Categorias; 