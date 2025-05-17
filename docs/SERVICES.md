# Documentación de Servicios

## Servicios de Autenticación (`authService.js`)

### `registrarUsuario(email, password)`
Registra un nuevo usuario en Firebase Authentication.
- **Parámetros:**
  - `email`: string - Correo electrónico del usuario
  - `password`: string - Contraseña del usuario
- **Retorna:** Promise con el usuario creado
- **Errores:** Lanza error si el registro falla

### `iniciarSesion(email, password)`
Inicia sesión de un usuario existente.
- **Parámetros:**
  - `email`: string - Correo electrónico del usuario
  - `password`: string - Contraseña del usuario
- **Retorna:** Promise con el usuario autenticado
- **Errores:** Lanza error si la autenticación falla

### `cerrarSesion()`
Cierra la sesión del usuario actual.
- **Retorna:** Promise<void>
- **Errores:** Lanza error si el cierre de sesión falla

## Servicios de Productos (`productosService.js`)

### `getProductos()`
Obtiene todos los productos de la base de datos.
- **Retorna:** Promise con array de productos
- **Errores:** Lanza error si la obtención falla

### `getProductoPorId(id)`
Obtiene un producto específico por su ID.
- **Parámetros:**
  - `id`: string - ID del producto
- **Retorna:** Promise con el producto
- **Errores:** Lanza error si el producto no existe

### `agregarProducto(productoData)`
Agrega un nuevo producto a la base de datos.
- **Parámetros:**
  - `productoData`: object - Datos del producto
- **Retorna:** Promise con el producto creado
- **Errores:** Lanza error si la creación falla

### `actualizarProducto(id, productoData)`
Actualiza un producto existente.
- **Parámetros:**
  - `id`: string - ID del producto
  - `productoData`: object - Nuevos datos del producto
- **Retorna:** Promise con el producto actualizado
- **Errores:** Lanza error si la actualización falla

### `eliminarProducto(id)`
Elimina un producto de la base de datos.
- **Parámetros:**
  - `id`: string - ID del producto
- **Retorna:** Promise<void>
- **Errores:** Lanza error si la eliminación falla

## Servicios de Pedidos (`pedidosService.js`)

### `getPedidosUsuario(usuarioId)`
Obtiene los pedidos de un usuario específico.
- **Parámetros:**
  - `usuarioId`: string - ID del usuario
- **Retorna:** Promise con array de pedidos
- **Errores:** Lanza error si la obtención falla

### `getTodosLosPedidos()`
Obtiene todos los pedidos de la base de datos.
- **Retorna:** Promise con array de pedidos
- **Errores:** Lanza error si la obtención falla

### `crearPedido(pedidoData)`
Crea un nuevo pedido.
- **Parámetros:**
  - `pedidoData`: object - Datos del pedido
- **Retorna:** Promise con el pedido creado
- **Errores:** Lanza error si la creación falla

### `actualizarEstadoPedido(pedidoId, nuevoEstado)`
Actualiza el estado de un pedido.
- **Parámetros:**
  - `pedidoId`: string - ID del pedido
  - `nuevoEstado`: string - Nuevo estado del pedido
- **Retorna:** Promise<void>
- **Errores:** Lanza error si la actualización falla

### `cancelarPedido(pedidoId)`
Cancela un pedido existente.
- **Parámetros:**
  - `pedidoId`: string - ID del pedido
- **Retorna:** Promise<void>
- **Errores:** Lanza error si la cancelación falla

## Servicios de Pagos (`pagosService.js`)

### `crearPago(monto, descripcion)`
Crea un nuevo pago a través de Stripe.
- **Parámetros:**
  - `monto`: number - Monto del pago
  - `descripcion`: string - Descripción del pago
- **Retorna:** Promise con el pago creado
- **Errores:** Lanza error si el pago falla

### `confirmarPago(paymentIntentId)`
Confirma un pago pendiente.
- **Parámetros:**
  - `paymentIntentId`: string - ID del pago
- **Retorna:** Promise con el pago confirmado
- **Errores:** Lanza error si la confirmación falla

## Estructura de Datos

### Producto
```typescript
interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  descripcion: string;
  categoria: string;
  imagen: string;
  enPromocion: boolean;
  precioOriginal?: number;
  descuento?: number;
}
```

### Pedido
```typescript
interface Pedido {
  id: string;
  usuarioId: string;
  items: Array<{
    id: string;
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  total: number;
  estado: 'pendiente' | 'enviado' | 'entregado' | 'cancelado';
  direccion: string;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  fechaEnvio?: Date;
  fechaEntrega?: Date;
}
```

### Usuario
```typescript
interface Usuario {
  id: string;
  email: string;
  nombre?: string;
  direccion?: string;
  telefono?: string;
  rol: 'usuario' | 'admin';
}
``` 