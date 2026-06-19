# 🔌 API REST · Node.js + Express + PostgreSQL + Docker

API REST completa y profesional con autenticación JWT, gestión de usuarios y CRUD de productos. Construida con Node.js, Express y PostgreSQL, totalmente dockerizada, con manejo de errores robusto y graceful shutdown.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

---

## ✨ Características

- 🔐 **Autenticación JWT** — registro, login y rutas protegidas con tokens
- 👥 **Gestión de usuarios** — CRUD completo
- 📦 **CRUD de productos** — operaciones completas sobre el recurso
- 🐘 **PostgreSQL** — base de datos relacional
- 🐳 **Dockerizado** — levanta la app y la base con un solo comando
- 🩺 **Health check** — endpoint `/health` para monitoreo
- 🛡️ **Manejo de errores global** — respuestas claras y consistentes, incluyendo errores de conexión a la base
- 🔄 **Graceful shutdown** — cierre seguro del servidor ante SIGTERM/SIGINT
- 🌐 **CORS configurable** por variable de entorno

---

## 🚀 Cómo levantarlo

### Con Docker (recomendado)
```bash
# Clona el repo
git clone https://github.com/champye1/api.git
cd api

# Copia el archivo de entorno y completa tus variables
cp .env.example .env

# Levanta la app + PostgreSQL
docker-compose up --build
```

La API queda corriendo en `http://localhost:3000`.

### Variables de entorno (.env)
```
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
DATABASE_URL=postgresql://usuario:password@db:5432/nombre_db
JWT_SECRET=tu_secreto_jwt
```

---

## 📋 Endpoints

> Las rutas protegidas requieren el header: `Authorization: Bearer <token>`

### 🩺 Health
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Verifica que la API está activa |

### 🔐 Autenticación · `/api/auth`
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar un nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión y obtener token JWT |

### 👥 Usuarios · `/api/usuarios`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios` | Listar todos los usuarios |
| GET | `/api/usuarios/:id` | Obtener un usuario por ID |
| PUT | `/api/usuarios/:id` | Actualizar un usuario |
| DELETE | `/api/usuarios/:id` | Eliminar un usuario |

### 📦 Productos · `/api/productos`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productos` | Listar todos los productos |
| GET | `/api/productos/:id` | Obtener un producto por ID |
| POST | `/api/productos` | Crear un producto |
| PUT | `/api/productos/:id` | Actualizar un producto |
| DELETE | `/api/productos/:id` | Eliminar un producto |

> ⚠️ Confirma los métodos exactos de cada recurso revisando los archivos en `src/routes/`. La tabla refleja un CRUD estándar.

---

## 🛠️ Stack técnico

- **Runtime:** Node.js
- **Framework:** Express
- **Base de datos:** PostgreSQL
- **Autenticación:** JSON Web Tokens (JWT)
- **Contenedores:** Docker + Docker Compose
- **Middleware:** CORS, body-parser

---

## 👤 Autor

**Esteban Venegas** — Full Stack Developer
[LinkedIn](https://www.linkedin.com/in/esteban-venegas-b06131281/) · [GitHub](https://github.com/champye1)
