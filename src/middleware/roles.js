/**
 * Middleware de autorización por roles
 * Verifica que el usuario tenga el rol requerido
 */

const verificarRol = (rolesRequeridos) => {
  return (req, res, next) => {
    // El middleware de autenticación debe ejecutarse primero
    if (!req.usuario) {
      return res.status(401).json({
        éxito: false,
        mensaje: 'No autenticado',
        error: 'Debe autenticarse antes de acceder a este recurso'
      });
    }

    // Verificar si el usuario tiene uno de los roles requeridos
    if (!rolesRequeridos.includes(req.usuario.rol)) {
      return res.status(403).json({
        éxito: false,
        mensaje: 'Acceso denegado',
        error: `Se requiere uno de los siguientes roles: ${rolesRequeridos.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Middleware para verificar si el usuario es admin
 */
const esAdmin = verificarRol(['admin']);

/**
 * Middleware para verificar si el usuario es admin o user
 */
const esUsuario = verificarRol(['user', 'admin']);

module.exports = {
  verificarRol,
  esAdmin,
  esUsuario
};
