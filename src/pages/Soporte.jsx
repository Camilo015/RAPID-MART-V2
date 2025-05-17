import React, { useState } from "react"; // Importar React y useState para manejar el estado
import "../styles/Soporte.css"; // Importar estilos específicos para la página de soporte
import Carrito from "../components/Carrito"; // Importar componente Carrito
import CarritoFlotante from "../components/CarritoFlotante"; // Importar componente Carrito Flotante
import Header from "../components/Header"; // Importar componente Header

// Componente principal de Soporte
const Soporte = () => {
  const [carrito, setCarrito] = useState([]); // Estado para almacenar los productos en el carrito
  const [mostrarCarrito, setMostrarCarrito] = useState(false); // Estado para controlar la visibilidad del carrito

  // Función para actualizar el carrito con nuevos items
  const actualizarCarrito = (nuevosItems) => {
    setCarrito(nuevosItems); // Actualizar el estado del carrito
  };

  // Calcular la cantidad total de productos en el carrito
  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <div className="app-container">
      <Header /> 

      <main className="soporte-container"> 
        <h1>Centro de Soporte</h1> 
        <div className="soporte-grid"> 
          
          {/* Sección de Preguntas Frecuentes */}
          <div className="soporte-section">
            <h2>Preguntas Frecuentes</h2>
            <div className="faq-container"> 
              <div className="faq-item">
                <h3>¿Cómo realizo un pedido?</h3>
                <p>Selecciona los productos que desees, agrégalos al carrito y sigue el proceso de pago.</p>
              </div>
              <div className="faq-item">
                <h3>¿Cuáles son los métodos de pago?</h3>
                <p>Aceptamos tarjetas de crédito, débito, transferencias y efectivo contra entrega.</p>
              </div>
              <div className="faq-item">
                <h3>¿Cuál es el tiempo de entrega?</h3>
                <p>Las entregas se realizan el mismo día para pedidos antes de las 6 PM.</p>
              </div>
            </div>
          </div>

          {/* Sección de Contacto */}
          <div className="soporte-section">
            <h2>Contáctanos</h2>
            <form className="contact-form"> 
              <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required /> 
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required /> 
              </div>
              <div className="form-group">
                <label htmlFor="asunto">Asunto:</label>
                <select id="asunto" name="asunto" required> 
                  <option value="">Seleccione un asunto</option>
                  <option value="pedido">Consulta sobre pedido</option>
                  <option value="producto">Información de producto</option>
                  <option value="reclamo">Reclamo</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="mensaje">Mensaje:</label>
                <textarea id="mensaje" name="mensaje" required></textarea> 
              </div>
              <button type="submit" className="submit-btn">Enviar Mensaje</button> 
            </form>
          </div>

          {/* Sección de Información de Contacto */}
          <div className="soporte-section">
            <h2>Información de Contacto</h2>
            <div className="contact-info"> 
              <div className="contact-item">
                <span className="icon">📞</span>
                <div className="contact-details">
                  <h3>Teléfono</h3>
                  <p>+57 300 123 4567</p>
                  <p>Lunes a Domingo: 8:00 AM - 8:00 PM</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="icon">✉️</span>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>soporte@rapidmart.com</p>
                  <p>Respuesta en menos de 24 horas</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="icon">💬</span>
                <div className="contact-details">
                  <h3>Chat en Vivo</h3>
                  <p>Disponible en horario de atención</p>
                  <button className="chat-btn">Iniciar Chat</button> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Carrito Flotante */}
      <CarritoFlotante 
        cantidad={cantidadTotal} // Pasar la cantidad total de productos al carrito flotante
        onClick={() => setMostrarCarrito(true)} // Manejar clic para mostrar el carrito
      />

      {/* Componente Carrito */}
      <Carrito
        visible={mostrarCarrito} // Controlar la visibilidad del carrito
        onClose={() => setMostrarCarrito(false)} // Manejar el cierre del carrito
        productos={carrito} // Pasar los productos al carrito
        onUpdateCart={actualizarCarrito} // Pasar la función para actualizar el carrito
      />
    </div>
  );
};

export default Soporte; 