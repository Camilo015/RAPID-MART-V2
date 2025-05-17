# Documentación de APIs

## Firebase Authentication

### Registro de Usuario
```javascript
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Inicio de Sesión
```javascript
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Cierre de Sesión
```javascript
POST /auth/logout
```

## Firebase Firestore

### Productos

#### Obtener Todos los Productos
```javascript
GET /productos
```

#### Obtener Producto por ID
```javascript
GET /productos/{id}
```

#### Crear Producto
```javascript
POST /productos
Content-Type: application/json

{
  "nombre": "Producto Ejemplo",
  "precio": 99.99,
  "stock": 100,
  "descripcion": "Descripción del producto",
  "categoria": "Categoría",
  "imagen": "url_imagen",
  "enPromocion": false
}
```

#### Actualizar Producto
```javascript
PUT /productos/{id}
Content-Type: application/json

{
  "nombre": "Producto Actualizado",
  "precio": 89.99,
  "stock": 50
}
```

#### Eliminar Producto
```javascript
DELETE /productos/{id}
```

### Pedidos

#### Obtener Pedidos de Usuario
```javascript
GET /pedidos/usuario/{usuarioId}
```

#### Obtener Todos los Pedidos
```javascript
GET /pedidos
```

#### Crear Pedido
```javascript
POST /pedidos
Content-Type: application/json

{
  "usuarioId": "id_usuario",
  "items": [
    {
      "id": "id_producto",
      "nombre": "Producto",
      "cantidad": 2,
      "precio": 99.99
    }
  ],
  "total": 199.98,
  "direccion": "Dirección de entrega"
}
```

#### Actualizar Estado de Pedido
```javascript
PUT /pedidos/{id}/estado
Content-Type: application/json

{
  "estado": "enviado"
}
```

#### Cancelar Pedido
```javascript
DELETE /pedidos/{id}
```

## Stripe API

### Crear Pago
```javascript
POST /pagos
Content-Type: application/json

{
  "monto": 199.98,
  "descripcion": "Pedido #12345"
}
```

### Confirmar Pago
```javascript
POST /pagos/{paymentIntentId}/confirmar
```

## Códigos de Estado

- `200 OK`: La solicitud se ha completado exitosamente
- `201 Created`: El recurso se ha creado exitosamente
- `400 Bad Request`: La solicitud es inválida
- `401 Unauthorized`: Se requiere autenticación
- `403 Forbidden`: No tiene permisos para acceder al recurso
- `404 Not Found`: El recurso no existe
- `500 Internal Server Error`: Error interno del servidor

## Ejemplos de Respuesta

### Producto
```json
{
  "id": "abc123",
  "nombre": "Producto Ejemplo",
  "precio": 99.99,
  "stock": 100,
  "descripcion": "Descripción del producto",
  "categoria": "Categoría",
  "imagen": "url_imagen",
  "enPromocion": false
}
```

### Pedido
```json
{
  "id": "pedido123",
  "usuarioId": "usuario456",
  "items": [
    {
      "id": "producto789",
      "nombre": "Producto",
      "cantidad": 2,
      "precio": 99.99
    }
  ],
  "total": 199.98,
  "estado": "pendiente",
  "direccion": "Dirección de entrega",
  "fechaCreacion": "2024-03-20T10:00:00Z"
}
```

### Error
```json
{
  "error": {
    "codigo": "ERROR_CODE",
    "mensaje": "Descripción del error",
    "detalles": "Información adicional del error"
  }
}
``` 