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