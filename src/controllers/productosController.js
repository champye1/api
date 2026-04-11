/**
 * Controlador de productos
 * Maneja operaciones CRUD para el catálogo de productos
 */

const Producto = require('../models/Producto');

/**
 * GET /api/productos
 * Listar todos los productos (público)
 */
const listarProductos = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;

    // Filtros opcionales
    const filtros = {
      categoria: req.query.categoria,
      busqueda: req.query.busqueda
    };

    const resultado = await Producto.obtenerTodos(pagina, limite, filtros);

    return res.status(200).json({
      éxito: true,
      mensaje: 'Productos obtenidos exitosamente',
      datos: resultado
    });
  } catch (error) {
    console.error('Error en listarProductos:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al listar productos',
      error: error.message
    });
  }
};

/**
 * GET /api/productos/:id
 * Obtener un producto por ID (público)
 */
const obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.obtenerPorId(id);

    if (!producto) {
      return res.status(404).json({
        éxito: false,
        mensaje: 'Producto no encontrado',
        error: `No existe producto con ID ${id}`
      });
    }

    return res.status(200).json({
      éxito: true,
      mensaje: 'Producto obtenido exitosamente',
      datos: {
        producto
      }
    });
  } catch (error) {
    console.error('Error en obtenerProducto:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al obtener el producto',
      error: error.message
    });
  }
};

/**
 * POST /api/productos
 * Crear un nuevo producto (requiere autenticación)
 */
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    const creadorId = req.usuario.id;

    // Crear producto
    const nuevoProducto = await Producto.crear(
      nombre,
      descripcion,
      parseFloat(precio),
      parseInt(stock),
      categoria,
      creadorId
    );

    return res.status(201).json({
      éxito: true,
      mensaje: 'Producto creado exitosamente',
      datos: {
        producto: nuevoProducto
      }
    });
  } catch (error) {
    console.error('Error en crearProducto:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al crear el producto',
      error: error.message
    });
  }
};

/**
 * PUT /api/productos/:id
 * Actualizar un producto (requiere ser el creador o admin)
 */
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria } = req.body;

    // Obtener producto
    const producto = await Producto.obtenerPorId(id);

    if (!producto) {
      return res.status(404).json({
        éxito: false,
        mensaje: 'Producto no encontrado',
        error: `No existe producto con ID ${id}`
      });
    }

    // Verificar permisos (creador o admin)
    if (producto.creador_id !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({
        éxito: false,
        mensaje: 'Acceso denegado',
        error: 'Solo el creador del producto o un administrador puede actualizarlo'
      });
    }

    // Construir objeto con datos a actualizar
    const datosActualizacion = {};
    if (nombre !== undefined) datosActualizacion.nombre = nombre;
    if (descripcion !== undefined) datosActualizacion.descripcion = descripcion;
    if (precio !== undefined) datosActualizacion.precio = parseFloat(precio);
    if (stock !== undefined) datosActualizacion.stock = parseInt(stock);
    if (categoria !== undefined) datosActualizacion.categoria = categoria;

    // Actualizar producto
    const productoActualizado = await Producto.actualizar(id, datosActualizacion);

    return res.status(200).json({
      éxito: true,
      mensaje: 'Producto actualizado exitosamente',
      datos: {
        producto: productoActualizado
      }
    });
  } catch (error) {
    console.error('Error en actualizarProducto:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al actualizar el producto',
      error: error.message
    });
  }
};

/**
 * DELETE /api/productos/:id
 * Eliminar un producto (requiere ser el creador o admin)
 */
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener producto
    const producto = await Producto.obtenerPorId(id);

    if (!producto) {
      return res.status(404).json({
        éxito: false,
        mensaje: 'Producto no encontrado',
        error: `No existe producto con ID ${id}`
      });
    }

    // Verificar permisos (creador o admin)
    if (producto.creador_id !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({
        éxito: false,
        mensaje: 'Acceso denegado',
        error: 'Solo el creador del producto o un administrador puede eliminarlo'
      });
    }

    // Eliminar producto
    await Producto.eliminar(id);

    return res.status(200).json({
      éxito: true,
      mensaje: 'Producto eliminado exitosamente',
      datos: {
        id: id
      }
    });
  } catch (error) {
    console.error('Error en eliminarProducto:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al eliminar el producto',
      error: error.message
    });
  }
};

/**
 * GET /api/productos/usuario/:usuarioId
 * Obtener productos de un usuario específico
 */
const obtenerProductosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;

    const resultado = await Producto.obtenerPorCreador(usuarioId, pagina, limite);

    return res.status(200).json({
      éxito: true,
      mensaje: 'Productos del usuario obtenidos exitosamente',
      datos: resultado
    });
  } catch (error) {
    console.error('Error en obtenerProductosPorUsuario:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al obtener los productos del usuario',
      error: error.message
    });
  }
};

/**
 * GET /api/productos/categorias/listado
 * Obtener todas las categorías disponibles
 */
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Producto.obtenerCategorias();

    return res.status(200).json({
      éxito: true,
      mensaje: 'Categorías obtenidas exitosamente',
      datos: {
        categorias
      }
    });
  } catch (error) {
    console.error('Error en obtenerCategorias:', error);
    return res.status(500).json({
      éxito: false,
      mensaje: 'Error al obtener las categorías',
      error: error.message
    });
  }
};

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPorUsuario,
  obtenerCategorias
};
