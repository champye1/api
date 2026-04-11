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
 * GET /api/productos
 * Listar todos los productos (público)
 * Query: ?pagina=1&limite=10&categoria=electronica&busqueda=laptop
 */
router.get('/', validarPaginacion, productosController.listarProductos);

/**
 * GET /api/productos/categorias/listado
 * Obtener todas las categorías (público)
 */
router.get('/categorias/listado', productosController.obtenerCategorias);

/**
 * GET /api/productos/usuario/:usuarioId
 * Obtener productos de un usuario específico (público)
 */
router.get('/usuario/:usuarioId', productosController.obtenerProductosPorUsuario);

/**
 * GET /api/productos/:id
 * Obtener un producto por ID (público)
 */
router.get('/:id', validarIdProducto, productosController.obtenerProducto);

/**
 * POST /api/productos
 * Crear un nuevo producto (requiere autenticación)
 * Body: { nombre, descripcion?, precio, stock, categoria? }
 */
router.post('/', verificarToken, validarProducto, productosController.crearProducto);

/**
 * PUT /api/productos/:id
 * Actualizar un producto (requiere ser creador o admin)
 * Body: { nombre?, descripcion?, precio?, stock?, categoria? }
 */
router.put('/:id', verificarToken, validarIdProducto, validarProducto, productosController.actualizarProducto);

/**
 * DELETE /api/productos/:id
 * Eliminar un producto (requiere ser creador o admin)
 */
router.delete('/:id', verificarToken, validarIdProducto, productosController.eliminarProducto);

module.exports = router;
