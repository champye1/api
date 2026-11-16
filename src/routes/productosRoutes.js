/**
 * Rutas de productos
 * Endpoints: listar, obtener, crear, actualizar, eliminar
 */

const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { verificarToken } = require('../middleware/autenticacion');
const { validarProducto, validarIdProducto, validarPaginacion } = require('../middleware/validaciones');

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Listar todos los productos (público)
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limite
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: categoria
 *         schema: { type: string }
 *       - in: query
 *         name: busqueda
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Listado de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get('/', validarPaginacion, productosController.listarProductos);

/**
 * @swagger
 * /api/productos/categorias/listado:
 *   get:
 *     summary: Obtener todas las categorías (público)
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Listado de categorías
 */
router.get('/categorias/listado', productosController.obtenerCategorias);

/**
 * @swagger
 * /api/productos/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener productos de un usuario específico (público)
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Productos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get('/usuario/:usuarioId', productosController.obtenerProductosPorUsuario);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID (público)
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', validarIdProducto, productosController.obtenerProducto);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto (requiere autenticación)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, precio, stock]
 *             properties:
 *               nombre: { type: string, example: Laptop }
 *               descripcion: { type: string, example: Laptop 15 pulgadas }
 *               precio: { type: number, example: 499990 }
 *               stock: { type: integer, example: 10 }
 *               categoria: { type: string, example: electronica }
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       401:
 *         description: No autenticado
 */
router.post('/', verificarToken, validarProducto, productosController.crearProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto (requiere ser creador o admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               descripcion: { type: string }
 *               precio: { type: number }
 *               stock: { type: integer }
 *               categoria: { type: string }
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', verificarToken, validarIdProducto, validarProducto, productosController.actualizarProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto (requiere ser creador o admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', verificarToken, validarIdProducto, productosController.eliminarProducto);

module.exports = router;
