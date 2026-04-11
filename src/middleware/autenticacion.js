/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido y obtiene los datos del usuario
 */

const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        éxito: false,
        mensaje: 'Token no proporcionado',
        error: 'Falta el header Authorization con token Bearer'
      });
    }

    // Verificar y decodificar el token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar datos del usuario al objeto request
    req.usuario = payload;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        éxito: false,
        mensaje: 'Token expirado',
        error: 'El token ha expirado. Por favor, inicie sesión nuevamente'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        éxito: false,
        mensaje: 'Token inválido',
        error: 'El token proporcionado no es válido'
      });
    }

    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al verificar el token',
      error: error.message
    });
  }
};

module.exports = {
  verificarToken
};
