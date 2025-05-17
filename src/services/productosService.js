import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../credenciales';

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'productos'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

// Obtener productos por categoría
export const getProductosPorCategoria = async (categoria) => {
  try {
    const q = query(collection(db, 'productos'), where('categoria', '==', categoria));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    throw error;
  }
};

// Obtener productos en promoción
export const getProductosEnPromocion = async () => {
  try {
    const q = query(collection(db, 'productos'), where('enPromocion', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener productos en promoción:', error);
    throw error;
  }
};

// Agregar un nuevo producto
export const agregarProducto = async (producto) => {
  try {
    const docRef = await addDoc(collection(db, 'productos'), {
      ...producto,
      precio: parseFloat(producto.precio),
      stock: parseInt(producto.stock),
      enPromocion: producto.enPromocion || false,
      precioOriginal: producto.enPromocion ? parseFloat(producto.precioOriginal) : null,
      descuento: producto.enPromocion ? parseFloat(producto.descuento) : null
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al agregar producto:', error);
    throw error;
  }
};

// Actualizar un producto existente
export const actualizarProducto = async (id, producto) => {
  try {
    const docRef = doc(db, 'productos', id);
    await updateDoc(docRef, {
      ...producto,
      precio: parseFloat(producto.precio),
      stock: parseInt(producto.stock),
      enPromocion: producto.enPromocion || false,
      precioOriginal: producto.enPromocion ? parseFloat(producto.precioOriginal) : null,
      descuento: producto.enPromocion ? parseFloat(producto.descuento) : null
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// Eliminar un producto
export const eliminarProducto = async (id) => {
  try {
    await deleteDoc(doc(db, 'productos', id));
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

// Migrar productos predefinidos
export const migrarProductos = async (productos) => {
  try {
    const batch = [];
    for (const producto of productos) {
      const productoData = {
        ...producto,
        precio: parseFloat(producto.precio),
        stock: parseInt(producto.stock),
        fechaCreacion: new Date()
      };
      batch.push(addDoc(collection(db, 'productos'), productoData));
    }
    await Promise.all(batch);
    return true;
  } catch (error) {
    console.error('Error al migrar productos:', error);
    throw error;
  }
}; 