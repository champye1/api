/**
 * Configuración de Swagger / OpenAPI
 * Genera la especificación a partir de los comentarios JSDoc en las rutas
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST Node.js + PostgreSQL',
      version: '1.0.0',
      description:
        'API REST con autenticación JWT, gestión de usuarios y CRUD de productos. Construida con Node.js, Express y PostgreSQL.',
      contact: {
        name: 'Esteban Venegas Cantillano',
        url: 'https://github.com/champye1',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Esteban Venegas' },
            email: { type: 'string', example: 'esteban@example.com' },
            rol: { type: 'string', example: 'usuario' },
          },
        },
        Producto: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Laptop' },
            descripcion: { type: 'string', example: 'Laptop 15 pulgadas' },
            precio: { type: 'number', example: 499990 },
            stock: { type: 'integer', example: 10 },
            categoria: { type: 'string', example: 'electronica' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            éxito: { type: 'boolean', example: false },
            mensaje: { type: 'string' },
            error: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Registro, login y perfil del usuario autenticado' },
      { name: 'Usuarios', description: 'Gestión de usuarios (requiere rol admin)' },
      { name: 'Productos', description: 'CRUD de productos' },
      { name: 'Health', description: 'Estado de la API' },
    ],
  },
  apis: ['./server.js', './src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
