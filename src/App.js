import {useState, React, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Cliente from "./pages/Cliente";
import Categorias from "./pages/Categorias";
import Promociones from "./pages/Promociones";
import HistorialPedidos from "./pages/HistorialPedidos";
import Soporte from "./pages/Soporte";
import Abarrotes from "./pages/Secciones/Abarrotes";
import Aseo from "./pages/Secciones/Aseo";
import Drogueria from "./pages/Secciones/Drogueria";   
import FyV from "./pages/Secciones/FyV"; 
import Lacteos from "./pages/Secciones/Lacteos";  
import Licores from "./pages/Secciones/Licores";  
import Mascotas from "./pages/Secciones/Mascotas";
import Panaderia from "./pages/Secciones/Panaderia";
import { CarritoProvider } from './context/CarritoContext';
import { PerfilProvider } from './context/PerfilContext';
import ProtectedRoute from "./components/ProtecteRoute";
import Inicio from "./pages/Inicio";
import AdminDashboard from './pages/AdminDashboard';
import DetalleProducto from "./pages/DetalleProducto";
import Perfil from './pages/Perfil';
//importacion de modulos de firebase
import { appFirebase } from './credenciales';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const auth = getAuth(appFirebase);



function App() {

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Detectar cambios en el estado de autenticación
        const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
            if (usuarioFirebase) {
                setUsuario(usuarioFirebase);
            } else {
                setUsuario(null);
            }
            setLoading(false);
        });

        // Limpiar el suscriptor cuando el componente se desmonte
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        
        <PerfilProvider>
        <CarritoProvider>
    <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                <Route
                path="/Cliente" 
                element={
                    <ProtectedRoute usuario={usuario}>
                         <Cliente correoUsuario={usuario?.email}/>
                    </ProtectedRoute>
                } />
 
                <Route path="/Inicio" element={<Inicio/>} />
                <Route path="/Categorias" element={<Categorias/>} />
                <Route path="/Promociones" element={<Promociones/>} />
                <Route path="/HistorialPedidos" element={<HistorialPedidos/>} />
                <Route path="/Soporte" element={<Soporte/>} />
                <Route path="/Abarrotes" element={<Abarrotes/>} />
                <Route path="/Aseo" element={<Aseo/>} />
                <Route path="/Drogueria" element={<Drogueria/>} />
                <Route path="/FyV" element={<FyV/>} />
                <Route path="/Lacteos" element={<Lacteos/>} />
                <Route path="/Licores" element={<Licores/>} />
                <Route path="/Mascotas" element={<Mascotas/>} />
                <Route path="/Panaderia" element={<Panaderia/>} />
                <Route path="/producto/:id" element={<DetalleProducto/>} />
                <Route path="/perfil" element={<Perfil />} />
                <Route 
                    path="/admin" 
                    element={
                        usuario ? <AdminDashboard /> : <Navigate to="/" />
                    } 
                />
            
            </Routes>
        </Router>
        </CarritoProvider>
        </PerfilProvider>
    );
}

export default App;
