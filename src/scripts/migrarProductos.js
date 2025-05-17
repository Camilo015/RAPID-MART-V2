import { migrarProductos } from '../services/productosService';

// Productos predefinidos por categoría
const productosLacteos = [
  {
    nombre: 'Leche Entera',
    descripcion: 'Leche entera en presentación de 1 litro',
    precio: '3.50',
    stock: '50',
    categoria: 'Lácteos',
    imagen: 'https://example.com/leche.jpg'
  },
  {
    nombre: 'Yogurt Natural',
    descripcion: 'Yogurt natural en presentación de 1 litro',
    precio: '2.80',
    stock: '40',
    categoria: 'Lácteos',
    imagen: 'https://example.com/yogurt.jpg'
  },
  {
    nombre: 'Queso Mozzarella',
    descripcion: 'Queso mozzarella en presentación de 250g',
    precio: '4.50',
    stock: '30',
    categoria: 'Lácteos',
    imagen: 'https://example.com/queso.jpg'
  }
];

const productosAbarrotes = [
  {
    nombre: 'Arroz Diana',
    descripcion: 'Arroz blanco en presentación de 1kg',
    precio: '2.50',
    stock: '100',
    categoria: 'Abarrotes',
    imagen: 'https://example.com/arroz.jpg'
  },
  {
    nombre: 'Aceite Girasol',
    descripcion: 'Aceite de girasol en presentación de 1 litro',
    precio: '3.80',
    stock: '60',
    categoria: 'Abarrotes',
    imagen: 'https://example.com/aceite.jpg'
  },
  {
    nombre: 'Azúcar Refinada',
    descripcion: 'Azúcar refinada en presentación de 1kg',
    precio: '1.80',
    stock: '80',
    categoria: 'Abarrotes',
    imagen: 'https://example.com/azucar.jpg'
  }
];

const productosAseo = [
  {
    nombre: 'Jabón en Polvo',
    descripcion: 'Jabón en polvo para ropa en presentación de 1kg',
    precio: '4.20',
    stock: '45',
    categoria: 'Aseo',
    imagen: 'https://example.com/jabon.jpg'
  },
  {
    nombre: 'Suavizante',
    descripcion: 'Suavizante para ropa en presentación de 1 litro',
    precio: '3.90',
    stock: '35',
    categoria: 'Aseo',
    imagen: 'https://example.com/suavizante.jpg'
  },
  {
    nombre: 'Detergente Líquido',
    descripcion: 'Detergente líquido para ropa en presentación de 1 litro',
    precio: '4.50',
    stock: '40',
    categoria: 'Aseo',
    imagen: 'https://example.com/detergente.jpg'
  }
];

// Función para migrar todos los productos
const migrarTodosLosProductos = async () => {
  try {
    console.log('Iniciando migración de productos...');
    
    console.log('Migrando productos lácteos...');
    await migrarProductos(productosLacteos);
    
    console.log('Migrando productos de abarrotes...');
    await migrarProductos(productosAbarrotes);
    
    console.log('Migrando productos de aseo...');
    await migrarProductos(productosAseo);
    
    console.log('Migración completada exitosamente');
  } catch (error) {
    console.error('Error durante la migración:', error);
  }
};

// Ejecutar la migración
migrarTodosLosProductos(); 