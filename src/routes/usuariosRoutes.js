/**
 * Rutas de gestión de usuarios
 * Endpoints: listar, obtener, actualizar, eliminar (requieren rol admin)
 */

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verificarToken } = require('../middleware/autenticacion');
const { esAdmin } = require('../middleware/roles');
const { validarUsuario, validarIdUsuario, validarPaginacion } = require('../middleware/validaciones');

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarToken);

/**
 * GET /api/usuarios
 * Listar todos los usuarios (requiere admin)
 * Query: ?pagina=1&limite=10
 */
router.get('/', esAdmin, validarPaginacion, usuariosController.listarUsuarios);

/**
 * GET /api/usuarios/:id
 * Obtener un usuario por ID (requiere admin)
 */
router.get('/:id', esAdmin, validarIdUsuario, usuariosController.obtenerUsuario);

/**
 * PUT /api/usuarios/:id
 * Actualizar un usuario (requiere admin)
 * Body: { nombre?, email?, contrasena?, rol? }
 */
router.put('/:id', esAdmin, validarIdUsuario, validarUsuario, usuariosController.actualizarUsuario);

/**
 * DELETE /api/usuarios/:id
 * Eliminar un usuario (requiere admin)
 */
router.delete('/:id', esAdmin, validarIdUsuario, usuariosController.eliminarUsuario);

module.exports = router;
