import { pool } from '../databases/db.js';

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Products ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).send('Producto no encontrado');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

// Crear producto
export const createProduct = async (req, res) => {
  const { name, img, description, price, stock, offert, tags, modalId, modalDescription, type } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Products (name, img, description, price, stock, offert, tags, modalId, modalDescription, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, img, description, price, stock, offert, tags, modalId, modalDescription, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

// Editar producto
export const updateProduct = async (req, res) => {
  const { name, img, description, price, stock, offert, tags, modalId, modalDescription, type } = req.body;
  try {
    const result = await pool.query(
      `UPDATE Products SET name = $1, img = $2, description = $3, price = $4, stock = $5, offert = $6, tags = $7, modalId = $8, modalDescription = $9, type = $10
       WHERE id = $11 RETURNING *`,
      [name, img, description, price, stock, offert, tags, modalId, modalDescription, type, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).send('Producto no encontrado');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM Products WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).send('Producto no encontrado');
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};
/*
import products from '../models/productsDb.js'; // Simulando una base de datos de productos

// Obtener todos los productos
export const getAllProducts = (req, res) => {
  res.json(products);
};

// Obtener producto por ID
export const getProductById = (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Producto no encontrado');
  res.json(product);
};

// Crear producto
export const createProduct = (req, res) => {
  const { name, img, description, price, stock, offert, tags, modalId, modalDescription, type } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    img,
    description,
    price,
    stock,
    offert,
    tags,
    modalId,
    modalDescription,
    type
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

// Editar producto
export const updateProduct = (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Producto no encontrado');

  const { name, img, description, price, stock, offert, tags, modalId, modalDescription, type } = req.body;
  product.name = name ?? product.name;
  product.img = img ?? product.img;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.stock = stock ?? product.stock;
  product.offert = offert ?? product.offert;
  product.tags = tags ?? product.tags;
  product.modalId = modalId ?? product.modalId;
  product.modalDescription = modalDescription ?? product.modalDescription;
  product.type = type ?? product.type;

  res.json(product);
};

// Eliminar producto
export const deleteProduct = (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Producto no encontrado');
  products.splice(index, 1);
  res.json({ message: 'Producto eliminado' });
};
*/