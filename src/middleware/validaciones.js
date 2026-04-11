/**
 * Reglas de validación para los diferentes endpoints
 * Usa express-validator para validar y sanitizar inputs
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const mensajesErrores = errores.array().map(error => ({
      campo: error.param,
      mensaje: error.msg,
      valor: error.value
    }));

    return res.status(400).json({
      éxito: false,
      mensaje: 'Validación fallida',
      errores: mensajesErrores
    });
  }

  next();
};

/**
 * Validaciones para registro de usuario
 */
const validarRegistro = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 255 }).withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('email')
    .trim()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  body('contrasena')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  manejarErroresValidacion
];

/**
 * Validaciones para login
 */
const validarLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  body('contrasena')
    .notEmpty().withMessage('La contraseña es requerida'),

  manejarErroresValidacion
];

/**
 * Validaciones para crear/actualizar usuario
 */
const validarUsuario = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  body('contrasena')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('rol')
    .optional()
    .isIn(['user', 'admin']).withMessage('Rol inválido'),

  manejarErroresValidacion
];

/**
 * Validaciones para crear/actualizar producto
 */
const validarProducto = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del producto es requerido')
    .isLength({ min: 2, max: 255 }).withMessage('El nombre debe tener entre 2 y 255 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no debe exceder 1000 caracteres'),

  body('precio')
    .notEmpty().withMessage('El precio es requerido')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),

  body('stock')
    .notEmpty().withMessage('El stock es requerido')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero no negativo'),

  body('categoria')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La categoría no debe exceder 100 caracteres'),

  manejarErroresValidacion
];

/**
 * Validar parámetro ID
 */
const validarIdProducto = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de producto inválido'),

  manejarErroresValidacion
];

const validarIdUsuario = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de usuario inválido'),

  manejarErroresValidacion
];

/**
 * Validar parámetros de paginación
 */
const validarPaginacion = [
  query('pagina')
    .optional()
    .isInt({ min: 1 }).withMessage('El número de página debe ser positivo'),

  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),

  manejarErroresValidacion
];

module.exports = {
  validarRegistro,
  validarLogin,
  validarUsuario,
  validarProducto,
  validarIdProducto,
  validarIdUsuario,
  validarPaginacion,
  manejarErroresValidacion
};
