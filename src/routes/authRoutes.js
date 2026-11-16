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
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, contrasena]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Esteban Venegas
 *               email:
 *                 type: string
 *                 example: esteban@example.com
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: claveSegura123
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', validarRegistro, authController.registrar);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, contrasena]
 *             properties:
 *               email:
 *                 type: string
 *                 example: esteban@example.com
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: claveSegura123
 *     responses:
 *       200:
 *         description: Login exitoso, retorna usuario y token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', validarLogin, authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/me', verificarToken, authController.obtenerPerfil);

module.exports = router;
