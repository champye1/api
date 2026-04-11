/**
 * Controlador de usuarios
 * Maneja operaciones CRUD de usuarios (solo para administradores)
 */

const Usuario = require('../models/Usuario');

/**
 * GET /api/usuarios
 * Listar todos los usuarios (requiere rol admin)
 */
const listarUsuarios = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;

    const resultado = await Usuario.obtenerTodos(pagina, limite);

    return res.status(200).json({
      éxito: true,
      mensaje: 'Usuarios obtenidos exitosamente',
      datos: resultado
    });
  } catch (error) {
    console.error('Error en listarUsuarios:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al listar usuarios',
      error: error.message
    });
  }
};

/**
 * GET /api/usuarios/:id
 * Obtener un usuario por ID (requiere rol admin)
 */
const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.obtenerPorId(id);

    if (!usuario) {
      return res.status(404).json({
        éxito: false,
        mensaje: 'Usuario no encontrado',
        error: `No existe usuario con ID ${id}`
      });
    }

    return res.status(200).json({
      éxito: true,
      mensaje: 'Usuario obtenido exitosamente',
      datos: {
        usuario
      }
    });
  } catch (error) {
    console.error('Error en obtenerUsuario:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al obtener el usuario',
      error: error.message
    });
  }
};

/**
 * PUT /api/usuarios/:id
 * Actualizar un usuario (requiere rol admin)
 */
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, contrasena, rol } = req.body;

    // Verificar que el usuario existe
    const usuarioExistente = await Usuario.obtenerPorId(id);
    if (!usuarioExistente) {
      return res.status(404).json({
        éxito: false,
        mensaje: 'Usuario no encontrado',
        error: `No existe usuario con ID ${id}`
      });
    }

    // Si se intenta cambiar el email, verificar que no exista otro con ese email
    if (email && email !== usuarioExistente.email) {
      const emailExiste = await Usuario.existeEmail(email);
      if (emailExiste) {
        return res.status(409).json({
          éxito: false,
          mensaje: 'Email ya en uso',
          error: 'Este email está registrado en otra cuenta'
        });
      }
    }

    // Actualizar usuario
    const datosActualizacion = {};
    if (nombre !== undefined) datosActualizacion.nombre = nombre;
    if (email !== undefined) datosActualizacion.email = email;
    if (contrasena !== undefined) datosActualizacion.contrasena = contrasena;
    if (rol !== undefined) datosActualizacion.rol = rol;

    const usuarioActualizado = await Usuario.actualizar(id, datosActualizacion);

    return res.status(200).json({
      éxito: true,
      mensaje: 'Usuario actualizado exitosamente',
      datos: {
        usuario: usuarioActualizado
      }
    });
  } catch (error) {
    console.error('Error en actualizarUsuario:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al actualizar el usuario',
      error: error.message
    });
  }
};

/**
 * DELETE /api/usuarios/:id
 * Eliminar un usuario (requiere rol admin)
 */
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const usuario = await Usuario.obtenerPorId(id);
    if (!usuario) {
      return res.status(404).json({
        éxito: false,
        mensaje: 'Usuario no encontrado',
        error: `No existe usuario con ID ${id}`
      });
    }

    // No permitir eliminar el último admin
    if (usuario.rol === 'admin') {
      // Verificar cuántos admins quedan
      const resultado = await require('../config/database').ejecutarQuery(
        'SELECT COUNT(*) FROM usuarios WHERE rol = $1',
        ['admin']
      );
      const cantidadAdmins = parseInt(resultado.rows[0].count);

      if (cantidadAdmins === 1) {
        return res.status(400).json({
          éxito: false,
          mensaje: 'No se puede eliminar',
          error: 'Debe existir al menos un usuario administrador'
        });
      }
    }

    // Eliminar usuario
    await Usuario.eliminar(id);

    return res.status(200).json({
      éxito: true,
      mensaje: 'Usuario eliminado exitosamente',
      datos: {
        id: id
      }
    });
  } catch (error) {
    console.error('Error en eliminarUsuario:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al eliminar el usuario',
      error: error.message
    });
  }
};

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario
};
