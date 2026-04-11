/**
 * Modelo de Producto
 * Define las operaciones de base de datos para productos
 */

const { pool, ejecutarQuery } = require('../config/database');

class Producto {
  /**
   * Crear un nuevo producto
   */
  static async crear(nombre, descripcion, precio, stock, categoria, creadorId) {
    const resultado = await ejecutarQuery(
      `INSERT INTO productos (nombre, descripcion, precio, stock, categoria, creador_id, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, nombre, descripcion, precio, stock, categoria, creador_id, estado, creado_en, actualizado_en`,
      [nombre, descripcion, precio, stock, categoria, creadorId, true]
    );

    return resultado.rows[0];
  }

  /**
   * Obtener producto por ID
   */
  static async obtenerPorId(id) {
    const resultado = await ejecutarQuery(
      `SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria,
              p.creador_id, p.estado, p.creado_en, p.actualizado_en,
              u.nombre as creador_nombre, u.email as creador_email
       FROM productos p
       LEFT JOIN usuarios u ON p.creador_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    return resultado.rows[0];
  }

  /**
   * Obtener todos los productos (con paginación y filtros)
   */
  static async obtenerTodos(pagina = 1, limite = 10, filtros = {}) {
    let condiciones = ['p.estado = true'];
    let valores = [];
    let contador = 1;

    // Aplicar filtros
    if (filtros.categoria) {
      condiciones.push(`p.categoria = $${contador++}`);
      valores.push(filtros.categoria);
    }

    if (filtros.busqueda) {
      condiciones.push(`(p.nombre ILIKE $${contador++} OR p.descripcion ILIKE $${contador++})`);
      const termino = `%${filtros.busqueda}%`;
      valores.push(termino, termino);
    }

    const offset = (pagina - 1) * limite;
    valores.push(limite, offset);

    const consultaSQL = `
      SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria,
             p.creador_id, p.estado, p.creado_en, p.actualizado_en,
             u.nombre as creador_nombre, u.email as creador_email
      FROM productos p
      LEFT JOIN usuarios u ON p.creador_id = u.id
      WHERE ${condiciones.join(' AND ')}
      ORDER BY p.creado_en DESC
      LIMIT $${contador++} OFFSET $${contador++}
    `;

    const resultado = await ejecutarQuery(consultaSQL, valores);

    // Obtener total de registros
    const totalSQL = `SELECT COUNT(*) FROM productos WHERE ${condiciones.slice(0, -2).join(' AND ') || 'estado = true'}`;
    const valoresSinPaginacion = valores.slice(0, -2);
    const totalResultado = await ejecutarQuery(totalSQL, valoresSinPaginacion);
    const total = parseInt(totalResultado.rows[0].count);

    return {
      productos: resultado.rows,
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite)
    };
  }

  /**
   * Obtener productos por creador
   */
  static async obtenerPorCreador(creadorId, pagina = 1, limite = 10) {
    const offset = (pagina - 1) * limite;

    const resultado = await ejecutarQuery(
      `SELECT id, nombre, descripcion, precio, stock, categoria, creador_id, estado, creado_en, actualizado_en
       FROM productos
       WHERE creador_id = $1 AND estado = true
       ORDER BY creado_en DESC
       LIMIT $2 OFFSET $3`,
      [creadorId, limite, offset]
    );

    // Obtener total
    const totalResultado = await ejecutarQuery(
      'SELECT COUNT(*) FROM productos WHERE creador_id = $1 AND estado = true',
      [creadorId]
    );
    const total = parseInt(totalResultado.rows[0].count);

    return {
      productos: resultado.rows,
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite)
    };
  }

  /**
   * Actualizar producto
   */
  static async actualizar(id, datos) {
    const campos = [];
    const valores = [];
    let contador = 1;

    if (datos.nombre !== undefined) {
      campos.push(`nombre = $${contador++}`);
      valores.push(datos.nombre);
    }

    if (datos.descripcion !== undefined) {
      campos.push(`descripcion = $${contador++}`);
      valores.push(datos.descripcion);
    }

    if (datos.precio !== undefined) {
      campos.push(`precio = $${contador++}`);
      valores.push(datos.precio);
    }

    if (datos.stock !== undefined) {
      campos.push(`stock = $${contador++}`);
      valores.push(datos.stock);
    }

    if (datos.categoria !== undefined) {
      campos.push(`categoria = $${contador++}`);
      valores.push(datos.categoria);
    }

    campos.push(`actualizado_en = CURRENT_TIMESTAMP`);
    valores.push(id);

    const resultado = await ejecutarQuery(
      `UPDATE productos SET ${campos.join(', ')}
       WHERE id = $${contador}
       RETURNING id, nombre, descripcion, precio, stock, categoria, creador_id, estado, creado_en, actualizado_en`,
      valores
    );

    return resultado.rows[0];
  }

  /**
   * Eliminar producto (borrado lógico)
   */
  static async eliminar(id) {
    const resultado = await ejecutarQuery(
      'DELETE FROM productos WHERE id = $1 RETURNING id',
      [id]
    );

    return resultado.rows[0];
  }

  /**
   * Obtener categorías únicas
   */
  static async obtenerCategorias() {
    const resultado = await ejecutarQuery(
      `SELECT DISTINCT categoria FROM productos WHERE estado = true AND categoria IS NOT NULL
       ORDER BY categoria`
    );

    return resultado.rows.map(row => row.categoria);
  }
}

module.exports = Producto;
