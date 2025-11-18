# Tienda API (Spring Boot)

Guía rápida para desarrollo, pruebas y credenciales de acceso.

## Requisitos
- Java `21`
- Maven Wrapper (incluido: `mvnw` / `mvnw.cmd`)
- MySQL en `localhost:3306` con usuario `root` y password vacía (configurable)

## Configuración
- Archivo: `src/main/resources/application.yml`
  - Base de datos: `jdbc:mysql://localhost:3306/tienda?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC`
  - CORS: origen permitido `http://localhost:5173` (Vite)
  - JWT: `security.jwt.secret` con fallback `dev-super-secret-please-change`

## Devtools (Hot Reload)
- Dependencia `spring-boot-devtools` ya incluida.
- Ejecuta en desarrollo con:
  - Windows: `.\n+mvnw spring-boot:run`
  - macOS/Linux: `./mvnw spring-boot:run`
- Al guardar cambios en el código, la API se reinicia automáticamente.

## Endpoints principales
- `POST /api/auth/register`: registro (rol por defecto `CLIENTE`)
- `POST /api/auth/login`: login por `username` o `email` (devuelve JWT y perfil)
- `GET /api/users/me`: perfil actual (requiere `Authorization: Bearer <token>`)
- `PUT /api/users/me`: actualizar perfil `nombre`, `email` (JWT)
- `PUT /api/users/me/password`: cambiar contraseña (JWT)

### Catálogo (Productos)
- `GET /api/products`: listar productos activos (público)
- `GET /api/products/{id}`: obtener producto por id (público)
- `POST /api/products`: crear producto (solo `ADMIN`)
- `PUT /api/products/{id}`: actualizar producto (solo `ADMIN`)
- `DELETE /api/products/{id}`: eliminar producto (solo `ADMIN`)

### Blog
- `GET /api/blogs`: listar posts activos (público)
- `GET /api/blogs/{id}`: obtener post por id (público)
- `POST /api/blogs`: crear post (solo `ADMIN`)
- `PUT /api/blogs/{id}`: actualizar post (solo `ADMIN`)
- `DELETE /api/blogs/{id}`: eliminar post (solo `ADMIN`)

## Credenciales de prueba
Se siembran automáticamente al arrancar la API (CommandLineRunner):
- Rol `ADMIN`:
  - Usuario: `admin`
  - Email: `admin@duoc.cl`
  - Password: `admin1234`
- Rol `CLIENTE`:
  - Usuario: `cliente`
  - Email: `cliente@duoc.cl`
  - Password: `cliente1234`

## Flujo de prueba rápido
1) Arranca MySQL y crea/inicializa la base `tienda` (se crea automáticamente con `ddl-auto: update`).
2) Ejecuta la API: `./mvnw spring-boot:run` (o `.\n+mvnw spring-boot:run`).
3) Login (ejemplo `curl`):
```
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin1234"}'
```
Respuesta:
```
{
  "token": "<JWT>",
  "username": "admin",
  "nombre": "Administrador",
  "email": "admin@duoc.cl",
  
  "role": "ADMIN"
}
```
4) Perfil:
```
curl http://localhost:8080/api/users/me \
  -H "Authorization: Bearer <JWT>"
```
5) Actualizar perfil:
```
curl -X PUT http://localhost:8080/api/users/me \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Nuevo Nombre","email":"nuevo@tienda.local"}'
```
6) Cambiar contraseña:
```
curl -X PUT http://localhost:8080/api/users/me/password \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"admin1234","newPassword":"admin5678"}'
```

## Variables de entorno (opcional)
- `JWT_SECRET`: clave para firmar tokens JWT (si no se establece, usa el valor dev por defecto).
- Para cambiar la conexión a MySQL, edita `spring.datasource.*` en `application.yml`.

## Frontend (Vite)
- Directorio: `Tienda-ReactJs/Front`
- Ejecuta: `npm install` y `npm run dev`.
- Base URL esperada: `http://localhost:8080`.

## Notas
- Los endpoints protegidos requieren `Authorization: Bearer <token>`.
- Los roles actuales son `ADMIN` y `CLIENTE`.