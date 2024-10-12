
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
  - `pid`: ID del producto.
- **Cuerpo de la solicitud:**
  ```json



### PROYECTO FINAL 2 


### 1. Profesionalizar el Servidor

- **Arquitectura Profesional:** 
  - Se han aplicado prácticas como el uso de DAO, DTO y el patrón Repository.
  - Se han utilizado variables de entorno para la configuración.

### 2. Modificar la Capa de Persistencia para Aplicar DAO y DTO

- **DAO y DTO:**
  - Se han creado DTOs para los usuarios en [`dao/dtos/userDTO.mjs`](dao/dtos/userDTO.mjs).
  - Se ha implementado el patrón Repository en [`dao/repositories/userRepository.mjs`](dao/repositories/userRepository.mjs).

### 3. Modificar la Ruta `/current` para Enviar un DTO del Usuario

- **Ruta `/current`:**
  - La ruta `/current` ha sido modificada para enviar un DTO del usuario en [`routes/sessions.mjs`](routes/sessions.mjs).

### 4. Middleware de Autorización

- **Middleware de Autorización:**
  - Se ha creado un middleware para manejar la autorización de usuarios basado en roles en [`middlewares/authMiddleware.mjs`](middlewares/authMiddleware.mjs).
  - Solo los administradores pueden crear, actualizar y eliminar productos.
  - Solo los usuarios pueden agregar productos a su carrito.

### 5. Crear un Modelo Ticket

- **Modelo Ticket:**
  - Se ha creado un modelo `Ticket` en [`dao/models/ticketModel.mjs`](dao/models/ticketModel.mjs) con los campos especificados:
    - `code`: String, autogenerado y único.
    - `purchase_datetime`: Date, fecha y hora de la compra.
    - `amount`: Number, total de la compra.
    - `purchaser`: String, correo del usuario asociado al carrito.

### 6. Implementar la Ruta `/carts/:cid/purchase`

- **Ruta `/carts/:cid/purchase`:**
  - Se ha implementado la ruta para finalizar el proceso de compra en [`routes/carts.mjs`](routes/carts.mjs).
  - La compra corrobora el stock del producto al momento de finalizarse.
  - Si el producto tiene suficiente stock, se resta del stock del producto.
  - Si el producto no tiene suficiente stock, no se agrega al proceso de compra.
  - Se genera un ticket con los datos de la compra.
  - En caso de existir una compra no completada, se devuelve el arreglo con los IDs de los productos que no pudieron procesarse.
  - Una vez finalizada la compra, el carrito asociado al usuario contiene solo los productos que no pudieron comprarse.

### 7. Verificación de Funcionalidades

- **Backend:**
  - Se han probado las funcionalidades de registro, login, autorización, creación de productos, adición de productos al carrito y finalización de compra.
  - Se ha verificado la persistencia de datos en MongoDB.

- **Frontend:**
  - Se han probado las funcionalidades de agregar productos al carrito desde la lista de productos y desde la vista detallada del producto.
  - Se ha probado la eliminación de productos del carrito.
  - Se ha probado la finalización de compra y la generación de tickets.