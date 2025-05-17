# Documentación de Componentes

## Componentes de Navegación

### `Header`
Componente principal de navegación que se muestra en todas las páginas.
- **Props:**
  - `isAuthenticated`: boolean - Indica si el usuario está autenticado
  - `user`: object - Datos del usuario actual
- **Funcionalidades:**
  - Navegación entre páginas
  - Acceso al carrito
  - Menú de usuario
  - Búsqueda de productos

### `AdminNav`
Navegación específica para el panel de administración.
- **Props:** Ninguna
- **Funcionalidades:**
  - Navegación entre secciones del panel
  - Acceso a gestión de productos
  - Acceso a gestión de pedidos
  - Botón de cerrar sesión

## Componentes de Autenticación

### `Login`
Formulario de inicio de sesión.
- **Props:** Ninguna
- **Funcionalidades:**
  - Formulario de login
  - Validación de campos
  - Manejo de errores
  - Redirección post-login

### `Register`
Formulario de registro de usuarios.
- **Props:** Ninguna
- **Funcionalidades:**
  - Formulario de registro
  - Validación de campos
  - Manejo de errores
  - Redirección post-registro

## Componentes de Productos

### `ProductoCard`
Tarjeta que muestra la información de un producto.
- **Props:**
  - `producto`: object - Datos del producto
  - `onAddToCart`: function - Función para agregar al carrito
- **Funcionalidades:**
  - Visualización de producto
  - Botón de agregar al carrito
  - Mostrar precio y descuentos

### `DetalleProducto`
Página de detalles de un producto.
- **Props:**
  - `id`: string - ID del producto
- **Funcionalidades:**
  - Mostrar detalles completos
  - Selector de cantidad
  - Agregar al carrito
  - Galería de imágenes

## Componentes de Carrito

### `CarritoItem`
Item individual en el carrito.
- **Props:**
  - `item`: object - Datos del item
  - `onUpdateQuantity`: function - Función para actualizar cantidad
  - `onRemove`: function - Función para eliminar item
- **Funcionalidades:**
  - Mostrar detalles del item
  - Actualizar cantidad
  - Eliminar item

### `CarritoResumen`
Resumen del carrito con totales.
- **Props:**
  - `items`: array - Items en el carrito
  - `onCheckout`: function - Función para proceder al pago
- **Funcionalidades:**
  - Mostrar subtotal
  - Calcular total
  - Botón de checkout

## Componentes de Pedidos

### `PedidoCard`
Tarjeta que muestra la información de un pedido.
- **Props:**
  - `pedido`: object - Datos del pedido
- **Funcionalidades:**
  - Mostrar estado del pedido
  - Listar productos
  - Mostrar total
  - Mostrar fechas importantes

### `HistorialPedidos`
Página de historial de pedidos del usuario.
- **Props:** Ninguna
- **Funcionalidades:**
  - Listar pedidos
  - Filtrar por estado
  - Ver detalles de pedidos

## Componentes de Administración

### `AdminDashboard`
Panel principal de administración.
- **Props:** Ninguna
- **Funcionalidades:**
  - Gestión de productos
  - Gestión de pedidos
  - Estadísticas básicas

### `ProductoForm`
Formulario para crear/editar productos.
- **Props:**
  - `producto`: object - Datos del producto (opcional)
  - `onSubmit`: function - Función para guardar
- **Funcionalidades:**
  - Formulario de producto
  - Validación de campos
  - Subida de imágenes
  - Gestión de promociones

## Componentes de UI

### `Button`
Botón reutilizable.
- **Props:**
  - `variant`: string - Variante del botón
  - `onClick`: function - Función al hacer clic
  - `disabled`: boolean - Estado deshabilitado
- **Variantes:**
  - `primary`
  - `secondary`
  - `danger`
  - `success`

### `Input`
Campo de entrada reutilizable.
- **Props:**
  - `type`: string - Tipo de input
  - `value`: string - Valor actual
  - `onChange`: function - Función al cambiar
  - `error`: string - Mensaje de error
- **Tipos:**
  - `text`
  - `number`
  - `email`
  - `password`

### `Modal`
Ventana modal reutilizable.
- **Props:**
  - `isOpen`: boolean - Estado de apertura
  - `onClose`: function - Función para cerrar
  - `title`: string - Título del modal
- **Funcionalidades:**
  - Mostrar contenido modal
  - Animaciones
  - Cierre con escape/click fuera

## Estilos y Temas

### Variables Globales
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
}
```

### Breakpoints
```css
--breakpoint-sm: 576px;
--breakpoint-md: 768px;
--breakpoint-lg: 992px;
--breakpoint-xl: 1200px;
```

### Espaciado
```css
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
``` 