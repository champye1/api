/**
 * Servidor principal de la API REST
 * Configuración de Express, middleware global y manejo de errores
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const usuariosRoutes = require('./src/routes/usuariosRoutes');
const productosRoutes = require('./src/routes/productosRoutes');

const app = express();
const puerto = process.env.PORT || 3000;

// ========================================
// Middleware Global
// ========================================

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Middleware para logging de requests (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ========================================
// Rutas de la API
// ========================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    éxito: true,
    mensaje: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de usuarios
app.use('/api/usuarios', usuariosRoutes);

// Rutas de productos
app.use('/api/productos', productosRoutes);

// ========================================
// Rutas y Errores
// ========================================

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    éxito: false,
    mensaje: 'Ruta no encontrada',
    error: `${req.method} ${req.path} no existe`,
    sugerencia: 'Verifica que la URL sea correcta. Visita /health para verificar que la API está activa.'
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);

  // Si es un error de base de datos
  if (err.code && err.code.startsWith('ECONNREFUSED')) {
    return res.status(503).json({
      éxito: false,
      mensaje: 'Error de conexión a la base de datos',
      error: 'No se pudo conectar a PostgreSQL'
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    éxito: false,
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error procesando la solicitud'
  });
});

// ========================================
// Iniciar Servidor
// ========================================

const server = app.listen(puerto, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║         API REST Node.js + PostgreSQL          ║
║              🚀 Servidor activo 🚀             ║
╚════════════════════════════════════════════════╝

📡 Puerto: ${puerto}
🔧 Entorno: ${process.env.NODE_ENV || 'development'}
📍 Health Check: http://localhost:${puerto}/health

Documentación de endpoints en README.md
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor gracefully...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido. Cerrando servidor gracefully...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

module.exports = app;
