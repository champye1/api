/**
 * Modelo de Usuario
 * Define las operaciones de base de datos para usuarios
 */

const { pool, ejecutarQuery } = require('../config/database');
const bcrypt = require('bcrypt');

class Usuario {
  /**
   * Crear un nuevo usuario
   */
  static async crear(nombre, email, contrasena) {
    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

    const resultado = await ejecutarQuery(
      `INSERT INTO usuarios (nombre, email, contrasena, rol, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, email, rol, estado, creado_en, actualizado_en`,
      [nombre, email, contrasenaHasheada, 'user', true]
    );

    return resultado.rows[0];
  }

  /**
   * Obtener usuario por email
   */
  static async obtenerPorEmail(email) {
    const resultado = await ejecutarQuery(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    return resultado.rows[0];
  }

  /**
   * Obtener usuario por ID (sin contraseña)
   */
  static async obtenerPorId(id) {
    const resultado = await ejecutarQuery(
      `SELECT id, nombre, email, rol, estado, creado_en, actualizado_en
       FROM usuarios WHERE id = $1`,
      [id]
    );

    return resultado.rows[0];
  }

  /**
   * Obtener todos los usuarios (sin contraseñas)
   */
  static async obtenerTodos(pagina = 1, limite = 10) {
    const offset = (pagina - 1) * limite;

    const resultado = await ejecutarQuery(
      `SELECT id, nombre, email, rol, estado, creado_en, actualizado_en
       FROM usuarios
       ORDER BY creado_en DESC
       LIMIT $1 OFFSET $2`,
      [limite, offset]
    );

    // Obtener total de registros
    const totalResultado = await ejecutarQuery('SELECT COUNT(*) FROM usuarios');
    const total = parseInt(totalResultado.rows[0].count);

    return {
      usuarios: resultado.rows,
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite)
    };
  }

  /**
   * Actualizar usuario
   */
  static async actualizar(id, datos) {
    const campos = [];
    const valores = [];
    let contador = 1;

    // Construir dinámicamente la consulta UPDATE
    if (datos.nombre !== undefined) {
      campos.push(`nombre = $${contador++}`);
      valores.push(datos.nombre);
    }

    if (datos.email !== undefined) {
      campos.push(`email = $${contador++}`);
      valores.push(datos.email);
    }

    if (datos.contrasena !== undefined) {
      const contrasenaHasheada = await bcrypt.hash(datos.contrasena, 10);
      campos.push(`contrasena = $${contador++}`);
      valores.push(contrasenaHasheada);
    }

    if (datos.rol !== undefined) {
      campos.push(`rol = $${contador++}`);
      valores.push(datos.rol);
    }

    if (datos.estado !== undefined) {
      campos.push(`estado = $${contador++}`);
      valores.push(datos.estado);
    }

    // Agregar timestamp de actualización
    campos.push(`actualizado_en = CURRENT_TIMESTAMP`);

    if (campos.length === 1 && campos[0].includes('actualizado_en')) {
      // Solo se actualiza el timestamp
      const resultado = await ejecutarQuery(
        `UPDATE usuarios SET actualizado_en = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, nombre, email, rol, estado, creado_en, actualizado_en`,
        [id]
      );
      return resultado.rows[0];
    }

    valores.push(id);
    const resultado = await ejecutarQuery(
      `UPDATE usuarios SET ${campos.join(', ')}
       WHERE id = $${contador}
       RETURNING id, nombre, email, rol, estado, creado_en, actualizado_en`,
      valores
    );

    return resultado.rows[0];
  }

  /**
   * Eliminar usuario
   */
  static async eliminar(id) {
    const resultado = await ejecutarQuery(
      'DELETE FROM usuarios WHERE id = $1 RETURNING id',
      [id]
    );

    return resultado.rows[0];
  }

  /**
   * Verificar contraseña
   */
  static async verificarContrasena(contrasena, contrasenaHasheada) {
    return await bcrypt.compare(contrasena, contrasenaHasheada);
  }

  /**
   * Verificar si existe email
   */
  static async existeEmail(email) {
    const resultado = await ejecutarQuery(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    return resultado.rows.length > 0;
  }
}

module.exports = Usuario;
