# Backend (Spring Boot) – Plan y requisitos

Este backend se diseñará para soportar el Front (`Tienda-ReactJs/Front`) y cumplir la rúbrica. Aún no implementamos nada; este documento sirve para bosquejar entidades, endpoints y consideraciones técnicas.

## Arquitectura propuesta
- Framework: Spring Boot 3 (Java 17+)
- Persistencia: JPA/Hibernate con PostgreSQL (o H2 en desarrollo)
- Seguridad: Spring Security con JWT
- Validación: Bean Validation (Jakarta Validation)
- Documentación API: OpenAPI/Swagger UI
- Subida de imágenes: URL externa por ahora; más adelante endpoint de upload (opcional)

## Entidades principales
- Usuario: `id`, `nombre`, `apellidos`, `email`, `passwordHash`, `rol` (ADMIN, VENDEDOR, CLIENTE), `createdAt`
- Producto: `id`, `codigo`, `nombre`, `descripcion`, `precioNuevo`, `precioDescuento` (opcional), `stock`, `stockCritico`, `categoria`, `imagen`, `createdAt`
- Blog: `id`, `titulo`, `resumen`, `contenido`, `imagen`, `createdAt`
- Orden/Pedido: `id`, `usuarioId`, `items` (lista de `{productoId, nombre, precioUnitario, qty}`), `total`, `estado` (CREADA, PAGADA, ENVIADA, ENTREGADA), `createdAt`
- Contacto: `id`, `nombre`, `email`, `mensaje`, `createdAt` (para el formulario de contacto)
- Ubicaciones: `Region`, `Comuna` (para compra/envío), o bien un único endpoint que devuelve ambas.

## Endpoints (resumen)
Autenticación
- `POST /auth/login` – login (devuelve JWT y perfil)
- `POST /auth/register` – registro (rol por defecto CLIENTE)
- `GET /auth/me` – perfil actual

Usuarios (ADMIN)
- `GET /users` – listado paginado
- `POST /users` – crear
- `PUT /users/{id}` – actualizar
- `DELETE /users/{id}` – eliminar

Productos
- `GET /products` – listado paginado + filtros (`categoria`, `q`)
- `GET /products/{id}` – detalle
- `POST /products` (ADMIN/VENDEDOR) – crear
- `PUT /products/{id}` (ADMIN/VENDEDOR) – actualizar
- `DELETE /products/{id}` (ADMIN/VENDEDOR) – eliminar
- `GET /categories` – categorías disponibles

Blogs
- `GET /blogs` – listado paginado
- `GET /blogs/{id}` – detalle
- `POST /blogs` (ADMIN/VENDEDOR) – crear
- `PUT /blogs/{id}` (ADMIN/VENDEDOR) – actualizar
- `DELETE /blogs/{id}` (ADMIN/VENDEDOR) – eliminar

Carrito y Órdenes
- (Carrito se mantiene en cliente) 
- `POST /checkout` – crea orden a partir del carrito
- `GET /orders` (CLIENTE) – mis órdenes
- `GET /orders/{id}` (CLIENTE) – detalle
- `GET /admin/orders` (ADMIN/VENDEDOR) – todas
- `PUT /admin/orders/{id}` – cambiar estado

Contacto
- `POST /contact` – recibe el formulario de `Contacto.jsx`

Ubicaciones
- `GET /locations/regions` – regiones
- `GET /locations/regions/{id}/communes` – comunas por región

## Reglas de validación (alineadas al Front actual)
- Producto:
  - `codigo`: requerido, min 3 chars
  - `nombre`: requerido, max 100 chars
  - `descripcion`: opcional, max 500 chars
  - `precioNuevo`: número ≥ 0
  - `stock`: entero ≥ 0
  - `stockCritico`: entero ≥ 0 (opcional)
  - `categoria`: requerida
- Usuario:
  - `email`: dominios permitidos (`duoc.cl`, `profesor.duoc.cl`, `gmail.com`)
  - `password`: entre 4 y 10 caracteres (en backend: hash + políticas adicionales)

## Respuestas y errores
- Éxito: `{ data, message?, pagination? }`
- Error: `{ error: { code, message, details? } }`
- Paginación: `page`, `size`, `totalItems`, `totalPages`

## Próximos pasos
- Definir OpenAPI detallado y modelos (ver `endpoints.md`).
- Preparar `.env` en Front con `VITE_API_BASE_URL` y crear servicios HTTP.
- Integrar roles y protección de rutas en Front con los endpoints.