/**
 * Controlador de autenticación
 * Maneja registro, login y obtención del perfil del usuario
 */

const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
const registrar = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.obtenerPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({
        éxito: false,
        mensaje: 'El email ya está registrado',
        error: 'Este email ya está asociado a una cuenta'
      });
    }

    // Crear el usuario
    const nuevoUsuario = await Usuario.crear(nombre, email, contrasena);

    return res.status(201).json({
      éxito: true,
      mensaje: 'Usuario registrado exitosamente',
      datos: {
        usuario: nuevoUsuario
      }
    });
  } catch (error) {
    console.error('Error en registrar:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al registrar el usuario',
      error: error.message
    });
  }
};

/**
 * POST /api/auth/login
 * Iniciar sesión y obtener JWT
 */
const login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.obtenerPorEmail(email);

    if (!usuario) {
      return res.status(401).json({
        éxito: false,
        mensaje: 'Credenciales inválidas',
        error: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const contrasenaValida = await Usuario.verificarContrasena(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({
        éxito: false,
        mensaje: 'Credenciales inválidas',
        error: 'Email o contraseña incorrectos'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    return res.status(200).json({
      éxito: true,
      mensaje: 'Sesión iniciada exitosamente',
      datos: {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

/**
 * GET /api/auth/me
 * Obtener perfil del usuario autenticado
 */
const obtenerPerfil = async (req, res) => {
  try {
    // El usuario viene del middleware de autenticación
    const usuarioId = req.usuario.id;

    // Obtener datos completos del usuario
    const usuario = await Usuario.obtenerPorId(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        éxito: false,
        mensaje: 'Usuario no encontrado',
        error: 'El usuario no existe en la base de datos'
      });
    }

    return res.status(200).json({
      éxito: true,
      mensaje: 'Perfil obtenido exitosamente',
      datos: {
        usuario
      }
    });
  } catch (error) {
    console.error('Error en obtenerPerfil:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al obtener el perfil',
      error: error.message
    });
  }
};

module.exports = {
  registrar,
  login,
  obtenerPerfil
};
