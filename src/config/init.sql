-- Script de inicialización de la base de datos
-- Se ejecuta automáticamente al levantar el contenedor PostgreSQL

-- Crear extensión UUID (si no existe)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (rol IN ('user', 'admin')),
  estado BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice en email para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria VARCHAR(100),
  creador_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  estado BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices en productos
CREATE INDEX IF NOT EXISTS idx_productos_creador_id ON productos(creador_id);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON productos(estado);

-- Insertar usuario administrador de prueba (contraseña hasheada con bcrypt: admin123)
-- Hash: $2b$10$jBvEjZrCy3QqWq3W6YYZe.GmNnKqWH0MbqN7EWkJ0QpqNZwMq9HJm
INSERT INTO usuarios (nombre, email, contrasena, rol, estado)
VALUES (
  'Administrador',
  'admin@example.com',
  '$2b$10$jBvEjZrCy3QqWq3W6YYZe.GmNnKqWH0MbqN7EWkJ0QpqNZwMq9HJm',
  'admin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Insertar usuario de prueba (contraseña hasheada con bcrypt: usuario123)
-- Hash: $2b$10$0HjDfOVDN8UcfV8KxJmKKOj6YqVGMV6JsqJ0HcJ.qJ5Z.GfJWD8Zm
INSERT INTO usuarios (nombre, email, contrasena, rol, estado)
VALUES (
  'Usuario de Prueba',
  'usuario@example.com',
  '$2b$10$0HjDfOVDN8UcfV8KxJmKKOj6YqVGMV6JsqJ0HcJ.qJ5Z.GfJWD8Zm',
  'user',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Insertar productos de prueba
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, creador_id, estado)
VALUES
  ('Laptop Pro', 'Laptop de alta rendimiento para desarrollo', 1299.99, 15, 'electrónica', 1, true),
  ('Mouse inalámbrico', 'Mouse ergonómico con batería de larga duración', 29.99, 50, 'accesorios', 1, true),
  ('Teclado mecánico', 'Teclado mecánico RGB programable', 119.99, 30, 'accesorios', 2, true)
ON CONFLICT DO NOTHING;
