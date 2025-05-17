import { collection, getDocs, addDoc, query, where, orderBy, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuth } from 'firebase/auth';

// Obtener pedidos de un usuario
export const getPedidosUsuario = async (usuarioId) => {
  try {
    if (!usuarioId) {
      throw new Error('ID de usuario no proporcionado');
    }

    const pedidosRef = collection(db, 'pedidos');
    const q = query(
      pedidosRef,
      where('usuarioId', '==', usuarioId),
      orderBy('fechaCreacion', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const pedidos = [];

    querySnapshot.forEach((doc) => {
      const pedido = {
        id: doc.id,
        ...doc.data(),
        // Convertir Timestamps a Date
        fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
        fechaActualizacion: doc.data().fechaActualizacion?.toDate() || null,
        fechaEnvio: doc.data().fechaEnvio?.toDate() || null,
        fechaEntrega: doc.data().fechaEntrega?.toDate() || null
      };
      pedidos.push(pedido);
    });

    return pedidos;
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw new Error('Error al cargar el historial de pedidos: ' + error.message);
  }
};

// Crear un nuevo pedido
export const crearPedido = async (pedidoData) => {
  try {
    if (!pedidoData.usuarioId) {
      throw new Error('ID de usuario no proporcionado');
    }

    // Convertir la fecha a Timestamp de Firestore
    const pedidoConTimestamp = {
      ...pedidoData,
      fechaCreacion: Timestamp.fromDate(new Date()),
      estado: pedidoData.estado || 'pendiente'
    };

    const docRef = await addDoc(collection(db, 'pedidos'), pedidoConTimestamp);
    return { id: docRef.id, ...pedidoConTimestamp };
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw new Error('Error al crear el pedido: ' + error.message);
  }
};

// Obtener todos los pedidos
export const getTodosLosPedidos = async () => {
  try {
    const pedidosRef = collection(db, 'pedidos');
    const q = query(pedidosRef, orderBy('fechaCreacion', 'desc'));
    const querySnapshot = await getDocs(q);
    const pedidos = [];

    querySnapshot.forEach((doc) => {
      const pedido = {
        id: doc.id,
        ...doc.data(),
        fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
        fechaActualizacion: doc.data().fechaActualizacion?.toDate() || null,
        fechaEnvio: doc.data().fechaEnvio?.toDate() || null,
        fechaEntrega: doc.data().fechaEntrega?.toDate() || null
      };
      pedidos.push(pedido);
    });

    return pedidos;
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw new Error('Error al cargar los pedidos: ' + error.message);
  }
};

// Actualizar estado del pedido
export const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
  try {
    const pedidoRef = doc(db, 'pedidos', pedidoId);
    const fechaActual = new Date();

    const actualizacion = {
      estado: nuevoEstado,
      fechaActualizacion: Timestamp.fromDate(fechaActual)
    };

    // Agregar fechas específicas según el estado
    switch (nuevoEstado.toLowerCase()) {
      case 'enviado':
        actualizacion.fechaEnvio = Timestamp.fromDate(fechaActual);
        break;
      case 'entregado':
        actualizacion.fechaEntrega = Timestamp.fromDate(fechaActual);
        break;
    }

    await updateDoc(pedidoRef, actualizacion);
    return true;
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw new Error('Error al actualizar el estado del pedido: ' + error.message);
  }
};

// Cancelar un pedido
export const cancelarPedido = async (pedidoId) => {
  try {
    const pedidoRef = doc(db, 'pedidos', pedidoId);
    await deleteDoc(pedidoRef);
    return true;
  } catch (error) {
    console.error('Error al cancelar el pedido:', error);
    throw new Error('Error al cancelar el pedido: ' + error.message);
  }
};

export const pedidosService = {
  async cancelarPedido(pedidoId) {
    try {
      const pedidoRef = doc(db, 'pedidos', pedidoId);
      await deleteDoc(pedidoRef);
      return true;
    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
      throw error;
    }
  }
}; 