/**
 * Configuración y conexión a PostgreSQL
 * Pool de conexiones para reutilizar conexiones eficientemente
 */

const { Pool } = require('pg');
require('dotenv').config();

// Validar variables de entorno requeridas
const variablesRequeridas = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
variablesRequeridas.forEach(variable => {
  if (!process.env[variable]) {
    console.error(`Error: Variable de entorno ${variable} no está definida`);
    process.exit(1);
  }
});

// Configuración del pool de conexiones
const configuracionPool = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: parseInt(process.env.DB_POOL_SIZE) || 10,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS) || 2000,
};

const pool = new Pool(configuracionPool);

// Manejo de errores de conexión
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones:', err);
});

// Verificar conexión al iniciar
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('✓ Conectado a PostgreSQL exitosamente');
  }
});

// Función auxiliar para ejecutar queries
const ejecutarQuery = async (texto, valores = []) => {
  try {
    const resultado = await pool.query(texto, valores);
    return resultado;
  } catch (error) {
    console.error('Error en query:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  ejecutarQuery,
  // Función para cerrar el pool gracefully
  cerrarPool: async () => {
    await pool.end();
    console.log('Pool de conexiones cerrado');
  }
};
