
> **Nota:** El proyecto implementa una validación básica desde el frontend para asegurar que los campos del formulario de adición de productos no estén vacíos. No obstante, esta validación también podría realizarse de manera efectiva desde el backend.


# Documentación de Endpoints

## Productos

### Listar todos los productos en formato json
- **Ruta:** `GET /products/list`
- **Descripción:** Lista todos los productos con paginación y filtros.
- **Parámetros de consulta:**
  - `query` (opcional): Filtro de búsqueda.
  - `sort` (opcional): Orden de los resultados.
  - `page` (opcional): Número de página (por defecto 1).
  - `limit` (opcional): Límite de resultados por página (por defecto 10).

### Listar todos los productos para UI
- **Ruta:** `GET /products/`
- **Descripción:** Lista todos los productos con paginación y filtros.
- **Parámetros de consulta:**
  - `query` (opcional): Filtro de búsqueda.
  - `sort` (opcional): Orden de los resultados.
  - `page` (opcional): Número de página (por defecto 1).
  - `limit` (opcional): Límite de resultados por página (por defecto 10).
  
### Obtener un producto por ID
- **Ruta:** `GET /products/:pid`
- **Descripción:** Obtiene un producto específico por su ID.
- **Parámetros de ruta:**
  - `pid`: ID del producto.

### Agregar un nuevo producto
- **Ruta:** `POST /products`
- **Descripción:** Agrega un nuevo producto.
- **Cuerpo de la solicitud:**
  - `title`: Título del producto.
  - `description`: Descripción del producto.
  - `code`: Código del producto.
  - `price`: Precio del producto.
  - `status`: Estado del producto.
  - `stock`: Stock del producto.
  - `category`: Categoría del producto.
  - `thumbnails`: Array de URLs de imágenes del producto.

### Actualizar un producto por ID
- **Ruta:** `PUT /products/:pid`
- **Descripción:** Actualiza un producto específico por su ID.
- **Parámetros de ruta:**
  - `pid`: ID del producto.
- **Cuerpo de la solicitud:** Campos del producto a actualizar.

### Eliminar un producto por ID
- **Ruta:** `DELETE /products/:pid`
- **Descripción:** Elimina un producto específico por su ID.
- **Parámetros de ruta:**
  - `pid`: ID del producto.

## Carritos

### Crear un nuevo carrito
- **Ruta:** `POST /carts`
- **Descripción:** Crea un nuevo carrito.

### Listar productos de un carrito
- **Ruta:** `GET /carts/:cid`
- **Descripción:** Lista los productos de un carrito específico.
- **Parámetros de ruta:**
  - `cid`: ID del carrito.

### Agregar un producto a un carrito
- **Ruta:** `POST /carts/:cid/product/:pid`
- **Descripción:** Agrega un producto a un carrito específico.
- **Parámetros de ruta:**
  - `cid`: ID del carrito.
  - `pid`: ID del producto.

### Actualizar productos de un carrito
- **Ruta:** `PUT /carts/:cid`
- **Descripción:** Actualiza los productos de un carrito específico.
- **Parámetros de ruta:**
  - `cid`: ID del carrito.
- **Cuerpo de la solicitud:** Array de productos a actualizar.

### Actualizar la cantidad de un producto en un carrito
- **Ruta:** `PUT /carts/:cid/products/:pid`
- **Descripción:** Actualiza la cantidad de un producto en un carrito específico.
- **Parámetros de ruta:**
  - `cid`: ID del carrito.
  - `
