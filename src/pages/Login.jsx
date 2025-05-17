import React, { useState } from "react";
import "../styles/style.css";
import { useNavigate } from 'react-router-dom';
import { IoPersonOutline, IoKeyOutline, IoCloseCircleOutline } from "react-icons/io5";
import { appFirebase } from '../credenciales';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import logoadmin from '../images/logoadmin.png';

const auth = getAuth(appFirebase);

const LoginPage = () => {
  const [registrando, setRegistrando] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ show: false, message: '', type: '' });
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();

  // Función para mostrar alertas
  const showAlert = (message, type) => {
    setAlertMessage({ show: true, message, type });
    setTimeout(() => {
      setAlertMessage({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Función para el registro de usuarios
  const handleRegister = async (e) => {
    e.preventDefault();

    const correo = e.target.emailRegister.value;
    const contraseña = e.target.passwordRegister.value;

    try {
      await createUserWithEmailAndPassword(auth, correo, contraseña);
      showAlert("¡Registro exitoso! Ahora puedes iniciar sesión.", "success");
      navigate('/');
    } catch (error) {
      console.error("Error en el registro:", error.message);
      showAlert("Error en el registro: " + error.message, "error");
    }
  };

  // Función para el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();

    const correo = e.target.emailLogin.value;
    const contraseña = e.target.passwordLogin.value;

    try {
      await signInWithEmailAndPassword(auth, correo, contraseña);
      showAlert("¡Inicio de sesión exitoso!", "success");
      setTimeout(() => {
        navigate('/Cliente');
      }, 1500);
    } catch (error) {
      showAlert("Error de autenticación: El correo o la contraseña son incorrectos", "error");
    }
  };

  // Función para restablecer contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const correo = e.target.emailReset.value;

    try {
      await sendPasswordResetEmail(auth, correo);
      showAlert("Se ha enviado un correo para restablecer tu contraseña", "success");
      setShowResetPassword(false);
    } catch (error) {
      showAlert("Error al enviar el correo de restablecimiento: " + error.message, "error");
    }
  };

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isPopupActive, setIsPopupActive] = useState(false);

  const handleOpenLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
    setShowResetPassword(false);
    setIsPopupActive(true);
  };

  const handleOpenRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    setShowResetPassword(false);
    setRegistrando(true);
  };

  const handleOpenResetPassword = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowResetPassword(true);
  };

  const handleClosePopup = () => {
    setIsPopupActive(false);
    setTimeout(() => {
      setShowLogin(false);
      setShowRegister(false);
      setShowResetPassword(false);
    }, 400);
  };

  return (
    <div>
      <header>
        <h2 className="logo">
          <img src="../LOGO SENA.png" width="200" height="70" alt="Logo SENA" />
        </h2>

        <div className="nav-buttons">
          <nav className="navigation">
            <button className="btnLogin-popup" onClick={handleOpenLogin}>LOGIN</button>
          </nav>
        </div>
      </header>

      {alertMessage.show && (
        <div className={`alert ${alertMessage.type}`}>
          {alertMessage.message}
        </div>
      )}

      <div className={`wrapper ${isPopupActive ? "active-popup" : ""}`} style={{ transform: isPopupActive ? "scale(1)" : "scale(0)" }}>
        <span className="icon-close" onClick={handleClosePopup}>
          <IoCloseCircleOutline />
        </span>

        {/* Formulario de Login */}
        {showLogin && (
          <div className="form-box login active">
            <h2>Ingreso</h2>
            <form onSubmit={handleLogin}>
              <div className="input-box">
                <span className="icon"><IoPersonOutline /></span>
                <input type="text" required name="emailLogin" id="emailLogin" />
                <label>Usuario</label>
              </div>

              <div className="input-box">
                <span className="icon"><IoKeyOutline /></span>
                <input type="password" required name="passwordLogin" id="passwordLogin" />
                <label>Contraseña</label>
              </div>

              <div className="Guardar-Datos">
                <label>
                  <input type="checkbox" /> Guardar Datos
                </label>
                <a href="#" onClick={handleOpenResetPassword}>Restablecer contraseña</a>
              </div>

              <button type="submit" className="btn">Ingresar</button>

              <div className="Ingreso-Registro">
                <p>No tienes una cuenta? <a href="#" className="Link-de-registro" onClick={handleOpenRegister}>Registrarse</a></p>
              </div>
            </form>
          </div>
        )}

        {/* Formulario de Registro */}
        {showRegister && (
          <div className="form-box register active">
            <h2>Registro</h2>
            <form onSubmit={handleRegister}>
              <div className="input-box">
                <span className="icon"><IoPersonOutline /></span>
                <input type="text" required name="emailRegister" id="emailRegister" />
                <label>Correo</label>
              </div>

              <div className="input-box">
                <span className="icon"><IoKeyOutline /></span>
                <input type="password" required name="passwordRegister" id="passwordRegister" />
                <label>Contraseña</label>
              </div>

              <div className="Guardar-Datos">
                <label>
                  <input type="checkbox" /> Aceptar términos y condiciones
                </label>
              </div>

              <button type="submit" className="btn">Registrarse</button>

              <div className="Ingreso-Registro">
                <p>Ya tienes una cuenta? <a href="#" className="Link-de-ingreso" onClick={handleOpenLogin}>Ingresar</a></p>
              </div>
            </form>
          </div>
        )}

        {/* Formulario de Restablecer Contraseña */}
        {showResetPassword && (
          <div className="form-box reset-password active">
            <h2>Restablecer Contraseña</h2>
            <form onSubmit={handleResetPassword}>
              <div className="input-box">
                <span className="icon"><IoPersonOutline /></span>
                <input type="email" required name="emailReset" id="emailReset" />
                <label>Correo Electrónico</label>
              </div>

              <button type="submit" className="btn">Enviar Correo</button>

              <div className="Ingreso-Registro">
                <p>¿Recordaste tu contraseña? <a href="#" className="Link-de-ingreso" onClick={handleOpenLogin}>Volver al inicio de sesión</a></p>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Enlaces a otras páginas */}
      <a href="AdminDashboard" className="admin-link">
        <img src={logoadmin} alt="Acceso Administrador" className="LogoAdmin" />
      </a>

  
    </div>
  );
};

export default LoginPage;
