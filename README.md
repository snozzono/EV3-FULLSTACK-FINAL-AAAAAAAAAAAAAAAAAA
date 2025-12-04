# EV3-FULLSTACK-FINAL-AAAAAAAAAAAAAAAAAA

Proyecto Fullstack de tienda Manga Store con frontend React y backend Spring Boot.

## Requisitos
- Node.js 18+
- Java 21
- Maven 3.9+
- MySQL 8 (desarrollo local)

## Estructura
- `Front/`: aplicación React con Vite
- `backend/tienda-api/`: API Spring Boot

## Ejecución
- Backend: `./mvnw spring-boot:run` (desde `backend/tienda-api`)
- Frontend: `npm install && npm run dev` (desde `Front`)

## Credenciales de prueba
- Admin: `admin2@gmail.com / p123123`
- Admin (seed): `admin@duoc.cl / admin1234`
- Cliente (seed): `cliente@duoc.cl / cliente1234`

## Funcionalidades clave
- Autenticación y roles (`ADMIN`, `CLIENTE`)
- Perfil del cliente con persistencia de datos completos
- Carrito con región en dropdown y comuna dependiente
- Checkout con disponibilidad de retiro en tienda
- Órdenes del cliente y detalle de boleta
- Panel Admin: productos, blogs, contacto, usuarios, compras

## API
- Base: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

## Notas
- Se excluyen archivos `.md` y `.txt` no esenciales del repositorio
- La documentación queda en este `README.md`

## Cambios recientes (Revisión Final)
- Listado de usuarios en `/admin/usuarios` muestra campos completos: `RUN`, `Apellidos`, `Fecha Nac.`, `Región`, `Comuna`, `Dirección`.
- Backend usuarios con CRUD y campos extendidos:
  - `UserController` expone `GET /api/users`, `GET /api/users/{id}`, `POST /api/users`, `PUT /api/users/{id}`, `DELETE /api/users/{id}`.
  - Login y registro sincronizan el store de usuarios en memoria (`AuthController` llama a `ensureUser`/`addUser`).
- Perfil: botón “Ver compras” redirige según rol (`ADMIN` → `/admin/compras/:id`, `CLIENTE` → `/cliente/perfil/:id`).
- Productos y Blogs ajustados al contexto demo; endpoints de poda (`/api/products/prune`, `/api/blogs/prune`) permiten limitar a 2 elementos.
- Servido de imágenes desde `uploads/` y utilidades para borrar por patrón de imagen.
- CORS habilitado para `http://localhost:5173` y datos de demo en memoria con fallback a `backend/mock/*.json`.

## Archivos tocados
- Frontend:
  - `Front/src/admin/AdminUsuarios.jsx` (columnas y rendering de campos adicionales)
  - `Front/src/pages/Perfil.jsx` (redirección “Ver compras” por rol)
- Backend:
  - `backend/tienda-api/src/main/java/cl/duoc/tienda/controller/UserController.java` (modelo extendido y CRUD)
  - `backend/tienda-api/src/main/java/cl/duoc/tienda/controller/AuthController.java` (alta/aseguramiento de usuarios en login/registro)
  - `backend/tienda-api/src/main/java/cl/duoc/tienda/controller/ProductController.java` y `BlogController.java` (poda y datos demo)

## Consideraciones
- El almacenamiento de usuarios es en memoria para la demo; si se requiere persistencia real, migrar a JPA/Repository contra MySQL.
- El token es de desarrollo (`dev-token`) y no representa seguridad productiva.
