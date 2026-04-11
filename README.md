# API REST Node.js + PostgreSQL + Docker

API REST completa y profesional construida con Node.js, Express, PostgreSQL y Docker. Incluye autenticación JWT, gestión de usuarios, y CRUD de productos.

## 🎯 Características

- ✅ **Autenticación JWT** - Registro y login seguros
- ✅ **Gestión de Usuarios** - CRUD completo con roles (admin/user)
- ✅ **Catálogo de Productos** - CRUD con permisos por propietario
- ✅ **Validación de Inputs** - Express-validator en todos los endpoints
- ✅ **Manejo de Errores** - Respuestas consistentes y descriptivas
- ✅ **Seguridad** - Passwords hasheados con bcrypt, sin contraseñas en responses
- ✅ **Docker & Docker Compose** - Multi-stage build, desarrollo y producción
- ✅ **PostgreSQL** - Base de datos robusta con índices y FK
- ✅ **pgAdmin** - Interfaz gráfica para gestionar BD (incluida)
- ✅ **Paginación** - Endpoints con soporte de límite y página
- ✅ **Arquitectura por capas** - Controllers, routes, models, middleware

## 📋 Requisitos Previos

### Sin Docker
- **Node.js** v18+ ([descargar](https://nodejs.org/))
- **npm** v8+ (incluido con Node.js)
- **PostgreSQL** v13+ ([descargar](https://www.postgresql.org/download/))

### Con Docker
- **Docker** ([descargar](https://www.docker.com/products/docker-desktop))
- **Docker Compose** v2+ (incluido con Docker Desktop)

## 🚀 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

#### 1. Clonar/descargar el proyecto
```bash
cd api
```

#### 2. Crear archivo .env
```bash
cp .env.example .env
```

#### 3. Levantar los servicios
```bash
docker-compose up --build
```

La API estará disponible en: `http://localhost:3000`
pgAdmin estará disponible en: `http://localhost:5050`

```bash
# Ver logs en tiempo real
docker-compose logs -f app

# Entrar al contenedor de la app
docker-compose exec app sh

# Bajar los servicios
docker-compose down

# Bajar los servicios y eliminar volúmenes (limpiar BD)
docker-compose down -v
```

---

### Opción 2: Sin Docker (Local)

#### 1. Instalar dependencias
```bash
npm install
```

#### 2. Configurar PostgreSQL

##### En Windows (pgAdmin o psql):
```sql
CREATE DATABASE api_db;
CREATE USER admin WITH PASSWORD 'admin123';
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin SET default_transaction_deferrable TO off;
ALTER ROLE admin SET default_transaction_read_only TO off;
ALTER ROLE admin SET statement_timeout TO 0;
ALTER ROLE admin SET lock_timeout TO 0;
ALTER ROLE admin SET idle_in_transaction_session_timeout TO 0;
ALTER ROLE admin SET search_path TO public;
GRANT ALL PRIVILEGES ON DATABASE api_db TO admin;
```

##### En Mac/Linux:
```bash
# Conectar a PostgreSQL
psql -U postgres

# En la terminal de psql:
CREATE DATABASE api_db;
CREATE USER admin WITH PASSWORD 'admin123';
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin SET default_transaction_deferrable TO off;
ALTER ROLE admin SET default_transaction_read_only TO off;
ALTER ROLE admin SET statement_timeout TO 0;
ALTER ROLE admin SET lock_timeout TO 0;
ALTER ROLE admin SET idle_in_transaction_session_timeout TO 0;
ALTER ROLE admin SET search_path TO public;
GRANT ALL PRIVILEGES ON DATABASE api_db TO admin;
\q
```

#### 3. Crear archivo .env
```bash
cp .env.example .env
```

Editar `.env` con los datos locales:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=api_db
DB_USER=admin
DB_PASSWORD=admin123
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRATION=24h
CORS_ORIGIN=*
```

#### 4. Ejecutar script SQL de inicialización
```bash
# Opción 1: Con psql
psql -U admin -d api_db -f src/config/init.sql

# Opción 2: Manualmente desde pgAdmin
# Copiar el contenido de src/config/init.sql y ejecutar en Query Tool
```

#### 5. Instalar dependencias de desarrollo
```bash
npm install -D nodemon
```

#### 6. Iniciar la API en modo desarrollo
```bash
npm run dev
```

La API estará disponible en: `http://localhost:3000`

---

## 📚 Documentación de Endpoints

### Base URL
```
http://localhost:3000/api
```

### Respuesta Estándar
Todos los endpoints devuelven:
```json
{
  "éxito": true,
  "mensaje": "Descripción de la operación",
  "datos": { /* contenido */ }
}
```

---

## 🔐 Autenticación

### POST /auth/register
Registrar un nuevo usuario.

**Endpoint:** `POST /api/auth/register`  
**Autenticación:** No requerida  
**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contrasena": "miPassword123"
}
```

**Response (201):**
```json
{
  "éxito": true,
  "mensaje": "Usuario registrado exitosamente",
  "datos": {
    "usuario": {
      "id": 3,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "user",
      "estado": true,
      "creado_en": "2024-01-15T10:30:00Z",
      "actualizado_en": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

### POST /auth/login
Iniciar sesión y obtener JWT.

**Endpoint:** `POST /api/auth/login`  
**Autenticación:** No requerida  
**Body:**
```json
{
  "email": "admin@example.com",
  "contrasena": "admin123"
}
```

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Sesión iniciada exitosamente",
  "datos": {
    "usuario": {
      "id": 1,
      "nombre": "Administrador",
      "email": "admin@example.com",
      "rol": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### GET /auth/me
Obtener perfil del usuario autenticado.

**Endpoint:** `GET /api/auth/me`  
**Autenticación:** ✅ Requerida (JWT)  
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Perfil obtenido exitosamente",
  "datos": {
    "usuario": {
      "id": 1,
      "nombre": "Administrador",
      "email": "admin@example.com",
      "rol": "admin",
      "estado": true,
      "creado_en": "2024-01-15T09:00:00Z",
      "actualizado_en": "2024-01-15T09:00:00Z"
    }
  }
}
```

---

## 👥 Gestión de Usuarios (Admin only)

### GET /usuarios
Listar todos los usuarios (requiere rol admin).

**Endpoint:** `GET /api/usuarios?pagina=1&limite=10`  
**Autenticación:** ✅ Requerida (JWT + Admin)  

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Usuarios obtenidos exitosamente",
  "datos": {
    "usuarios": [
      {
        "id": 1,
        "nombre": "Administrador",
        "email": "admin@example.com",
        "rol": "admin",
        "estado": true,
        "creado_en": "2024-01-15T09:00:00Z",
        "actualizado_en": "2024-01-15T09:00:00Z"
      }
    ],
    "pagina": 1,
    "limite": 10,
    "total": 1,
    "totalPaginas": 1
  }
}
```

---

### GET /usuarios/:id
Obtener un usuario por ID (requiere rol admin).

**Endpoint:** `GET /api/usuarios/1`  
**Autenticación:** ✅ Requerida (JWT + Admin)  

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Usuario obtenido exitosamente",
  "datos": {
    "usuario": {
      "id": 1,
      "nombre": "Administrador",
      "email": "admin@example.com",
      "rol": "admin",
      "estado": true,
      "creado_en": "2024-01-15T09:00:00Z",
      "actualizado_en": "2024-01-15T09:00:00Z"
    }
  }
}
```

---

### PUT /usuarios/:id
Actualizar un usuario (requiere rol admin).

**Endpoint:** `PUT /api/usuarios/1`  
**Autenticación:** ✅ Requerida (JWT + Admin)  
**Body:**
```json
{
  "nombre": "Nuevo Nombre",
  "email": "newemail@example.com",
  "rol": "admin"
}
```

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Usuario actualizado exitosamente",
  "datos": {
    "usuario": {
      "id": 1,
      "nombre": "Nuevo Nombre",
      "email": "newemail@example.com",
      "rol": "admin",
      "estado": true,
      "creado_en": "2024-01-15T09:00:00Z",
      "actualizado_en": "2024-01-15T11:00:00Z"
    }
  }
}
```

---

### DELETE /usuarios/:id
Eliminar un usuario (requiere rol admin).

**Endpoint:** `DELETE /api/usuarios/2`  
**Autenticación:** ✅ Requerida (JWT + Admin)  

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Usuario eliminado exitosamente",
  "datos": {
    "id": "2"
  }
}
```

---

## 📦 Productos (CRUD)

### GET /productos
Listar todos los productos (público, con filtros).

**Endpoint:** `GET /api/productos?pagina=1&limite=10&categoria=electronica&busqueda=laptop`  
**Autenticación:** ❌ No requerida  
**Query Parameters:**
- `pagina` (opcional): Número de página (default: 1)
- `limite` (opcional): Registros por página (default: 10, máx: 100)
- `categoria` (opcional): Filtrar por categoría
- `busqueda` (opcional): Buscar en nombre y descripción

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Productos obtenidos exitosamente",
  "datos": {
    "productos": [
      {
        "id": 1,
        "nombre": "Laptop Pro",
        "descripcion": "Laptop de alta rendimiento",
        "precio": 1299.99,
        "stock": 15,
        "categoria": "electrónica",
        "creador_id": 1,
        "creador_nombre": "Administrador",
        "creador_email": "admin@example.com",
        "estado": true,
        "creado_en": "2024-01-15T10:00:00Z",
        "actualizado_en": "2024-01-15T10:00:00Z"
      }
    ],
    "pagina": 1,
    "limite": 10,
    "total": 15,
    "totalPaginas": 2
  }
}
```

---

### GET /productos/:id
Obtener un producto por ID (público).

**Endpoint:** `GET /api/productos/1`  
**Autenticación:** ❌ No requerida  

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Producto obtenido exitosamente",
  "datos": {
    "producto": {
      "id": 1,
      "nombre": "Laptop Pro",
      "descripcion": "Laptop de alta rendimiento para desarrollo",
      "precio": 1299.99,
      "stock": 15,
      "categoria": "electrónica",
      "creador_id": 1,
      "creador_nombre": "Administrador",
      "creador_email": "admin@example.com",
      "estado": true,
      "creado_en": "2024-01-15T10:00:00Z",
      "actualizado_en": "2024-01-15T10:00:00Z"
    }
  }
}
```

---

### POST /productos
Crear un nuevo producto (requiere autenticación).

**Endpoint:** `POST /api/productos`  
**Autenticación:** ✅ Requerida (JWT)  
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Body:**
```json
{
  "nombre": "Monitor 4K",
  "descripcion": "Monitor Ultra HD de 32 pulgadas",
  "precio": 599.99,
  "stock": 20,
  "categoria": "accesorios"
}
```

**Response (201):**
```json
{
  "éxito": true,
  "mensaje": "Producto creado exitosamente",
  "datos": {
    "producto": {
      "id": 4,
      "nombre": "Monitor 4K",
      "descripcion": "Monitor Ultra HD de 32 pulgadas",
      "precio": 599.99,
      "stock": 20,
      "categoria": "accesorios",
      "creador_id": 2,
      "estado": true,
      "creado_en": "2024-01-15T11:30:00Z",
      "actualizado_en": "2024-01-15T11:30:00Z"
    }
  }
}
```

---

### PUT /productos/:id
Actualizar un producto (requiere ser el creador o admin).

**Endpoint:** `PUT /api/productos/4`  
**Autenticación:** ✅ Requerida (JWT)  
**Body:**
```json
{
  "precio": 549.99,
  "stock": 18
}
```

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Producto actualizado exitosamente",
  "datos": {
    "producto": {
      "id": 4,
      "nombre": "Monitor 4K",
      "descripcion": "Monitor Ultra HD de 32 pulgadas",
      "precio": 549.99,
      "stock": 18,
      "categoria": "accesorios",
      "creador_id": 2,
      "estado": true,
      "creado_en": "2024-01-15T11:30:00Z",
      "actualizado_en": "2024-01-15T12:00:00Z"
    }
  }
}
```

---

### DELETE /productos/:id
Eliminar un producto (requiere ser el creador o admin).

**Endpoint:** `DELETE /api/productos/4`  
**Autenticación:** ✅ Requerida (JWT)  

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Producto eliminado exitosamente",
  "datos": {
    "id": "4"
  }
}
```

---

### GET /productos/usuario/:usuarioId
Obtener productos de un usuario específico (público).

**Endpoint:** `GET /api/productos/usuario/1?pagina=1&limite=10`  
**Autenticación:** ❌ No requerida  

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Productos del usuario obtenidos exitosamente",
  "datos": {
    "productos": [
      {
        "id": 1,
        "nombre": "Laptop Pro",
        "precio": 1299.99,
        "stock": 15,
        "categoria": "electrónica",
        "creador_id": 1,
        "estado": true,
        "creado_en": "2024-01-15T10:00:00Z",
        "actualizado_en": "2024-01-15T10:00:00Z"
      }
    ],
    "pagina": 1,
    "limite": 10,
    "total": 3,
    "totalPaginas": 1
  }
}
```

---

### GET /productos/categorias/listado
Obtener todas las categorías disponibles (público).

**Endpoint:** `GET /api/productos/categorias/listado`  
**Autenticación:** ❌ No requerida  

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "Categorías obtenidas exitosamente",
  "datos": {
    "categorias": [
      "accesorios",
      "electrónica"
    ]
  }
}
```

---

## 🔍 Health Check

### GET /health
Verificar estado de la API.

**Endpoint:** `GET /health`  
**Autenticación:** ❌ No requerida  

**Response (200):**
```json
{
  "éxito": true,
  "mensaje": "API funcionando correctamente",
  "timestamp": "2024-01-15T12:30:00.000Z"
}
```

---

## 🛡️ Usuarios de Prueba

Al inicializar la base de datos, se crean dos usuarios de prueba:

### Admin
- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Rol:** admin

### Usuario
- **Email:** `usuario@example.com`
- **Password:** `usuario123`
- **Rol:** user

---

## 🐳 Comandos Docker Útiles

```bash
# Levantar servicios
docker-compose up --build

# Levantar en background
docker-compose up -d --build

# Ver logs en tiempo real
docker-compose logs -f app

# Ver logs de un servicio específico
docker-compose logs -f db

# Entrar al contenedor de la app
docker-compose exec app sh

# Ejecutar comando en el contenedor
docker-compose exec app npm test

# Bajar servicios
docker-compose down

# Bajar y eliminar volúmenes (limpia BD)
docker-compose down -v

# Reconstruir imagen
docker-compose build --no-cache

# Ver estado de los contenedores
docker-compose ps

# Detener servicios sin eliminar
docker-compose stop

# Reiniciar servicios
docker-compose restart
```

---

## 🗄️ Diagrama de Contenedores

```
┌─────────────────────────────────────────────────┐
│            Docker Network: api_network          │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │   app Container  │  │  db Container    │   │
│  │  Node.js/Express │  │  PostgreSQL 15   │   │
│  │    Port: 3000    │  │   Port: 5432     │   │
│  │                  │◄─┤                  │   │
│  │ ┌──────────────┐ │  │ ┌──────────────┐│   │
│  │ │ Controllers  │ │  │ │   usuarios   ││   │
│  │ │ Routes       │ │  │ │   productos  ││   │
│  │ │ Middleware   │ │  │ │   Indices    ││   │
│  │ │ Models       │ │  │ │   FK         ││   │
│  │ └──────────────┘ │  │ └──────────────┘│   │
│  └──────────────────┘  └──────────────────┘   │
│          ▲                      ▲              │
│          │ mount:code           │ mount:      │
│          │ hot reload           │ init.sql    │
│          │                      │ data vol.   │
│          │                      │             │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │  pgAdmin Container  │                      │
│  │  Port: 5050         │                      │
│  │  (Opcional)         │                      │
│  └──────────────────┘                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📦 Estructura del Proyecto

```
api/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de conexión PostgreSQL
│   │   └── init.sql             # Script SQL de inicialización
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticación
│   │   ├── usuariosController.js# Gestión de usuarios (admin)
│   │   └── productosController.js# CRUD de productos
│   ├── middleware/
│   │   ├── autenticacion.js     # Verificación JWT
│   │   ├── roles.js             # Verificación de roles
│   │   └── validaciones.js      # Validación de inputs
│   ├── models/
│   │   ├── Usuario.js           # Queries de usuarios
│   │   └── Producto.js          # Queries de productos
│   └── routes/
│       ├── authRoutes.js        # Rutas de autenticación
│       ├── usuariosRoutes.js    # Rutas de usuarios
│       └── productosRoutes.js   # Rutas de productos
├── server.js                    # Entrada principal Express
├── Dockerfile                   # Multi-stage build
├── docker-compose.yml           # Orquestación de servicios
├── package.json                 # Dependencias Node.js
├── .env.example                 # Variables de entorno (ejemplo)
├── .dockerignore                # Archivos a excluir de imagen Docker
├── .gitignore                   # Archivos a excluir de Git
└── README.md                    # Este archivo
```

---

## 🔒 Variables de Entorno

Ver `.env.example` para todas las variables:

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NODE_ENV` | Entorno (development/production) | development |
| `PORT` | Puerto del servidor | 3000 |
| `DB_HOST` | Host de PostgreSQL | db |
| `DB_PORT` | Puerto de PostgreSQL | 5432 |
| `DB_NAME` | Nombre de la base de datos | api_db |
| `DB_USER` | Usuario de PostgreSQL | admin |
| `DB_PASSWORD` | Password de PostgreSQL | admin123 |
| `JWT_SECRET` | Clave secreta JWT | - |
| `JWT_EXPIRATION` | Expiración del JWT | 24h |
| `CORS_ORIGIN` | Origen CORS permitido | * |

---

## 📝 Notas de Seguridad

- ⚠️ **Cambiar `JWT_SECRET`** en producción
- ⚠️ **Cambiar contraseña de BD** en producción
- ⚠️ **Cambiar contraseñas de usuarios de prueba** en producción
- ⚠️ **No incluir `.env`** en repositorio (usar `.env.example`)
- ✅ Las contraseñas se hashean con bcrypt (10 rounds)
- ✅ Las contraseñas nunca se devuelven en responses
- ✅ JWT expira después de 24h

---

## 🤝 Contribuir

Este proyecto es un ejemplo de portafolio. Siéntete libre de:
- Forkearlo
- Agregar más funcionalidades
- Mejorar la documentación
- Corregir bugs

---

## 📄 Licencia

MIT

---

## 👨‍💻 Autor

Desarrollado como proyecto de API profesional con arquitectura por capas.

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisa los logs: `docker-compose logs -f app`
2. Verifica que PostgreSQL esté levantada: `docker-compose ps`
3. Prueba el health check: `curl http://localhost:3000/health`
4. Revisa las variables de entorno en `.env`

---

**¡Listo para producción! 🚀**
