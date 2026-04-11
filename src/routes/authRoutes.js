/**
 * Rutas de autenticación
 * Endpoints: registro, login, obtener perfil
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/autenticacion');
const { validarRegistro, validarLogin } = require('../middleware/validaciones');

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 * Body: { nombre, email, contrasena }
 */
router.post('/register', validarRegistro, authController.registrar);

/**
 * POST /api/auth/login
 * Iniciar sesión
 * Body: { email, contrasena }
 * Response: { usuario, token }
 */
router.post('/login', validarLogin, authController.login);

/**
 * GET /api/auth/me
 * Obtener perfil del usuario autenticado
 * Headers: Authorization: Bearer {token}
 */
router.get('/me', verificarToken, authController.obtenerPerfil);

module.exports = router;
