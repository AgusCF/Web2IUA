CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'client')) DEFAULT 'client'
);
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    img TEXT,
    description TEXT,
    price NUMERIC(10, 2),
    stock INTEGER,
    offert NUMERIC(3, 1) DEFAULT 0,  -- Descuento en porcentaje
    tags TEXT[]  -- Array de palabras clave
);

-- Tabla de órdenes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla intermedia para los productos en cada orden
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

\d products
ALTER TABLE products
ADD COLUMN modalid text,
ADD COLUMN modaldescription text;
\d products

ALTER TABLE users
ADD COLUMN tel text;

INSERT INTO users (id, username, password, tel) VALUES
  (1, 'admin', 'admin123', 321456789),
  (2, 'user1', 'user123', 321987654),
  (3, 'user2', 'user456', 321654321),
  (4, 'user3', 'user789', 321123456);


ALTER TABLE products
ADD COLUMN type text;
INSERT INTO products (
  id, name, img, description, price, stock, offert, tags, modalid, modaldescription, type
) VALUES
(1, 'Alfajor Bonobón', '/uploads/CarruselInicio/AlfBonobon.png', 'Doble capa de dulce de leche...', 8000, 10, 0, ARRAY['Alfajor','Dulce de leche','Chocolate','Galletita'], 'modalAlfBon', 'Doble capa de dulce...', 'Alfajores'),
(2, 'Alfajor Bonobón', '/uploads/CarruselInicio/AlfBonobon.png', 'Doble capa de dulce de leche entre galletas suaves con cobertura de chocolate con maní.', 8000, 10, 0, ARRAY['Alfajores','Dulce de leche','Chocolate','Maní'], 'modalAlfBon', 'Doble capa de dulce de leche entre galletas suaves, bañado en chocolate con maní picado. Una explosión de sabor clásico.', 'Alfajores'),
(3, 'Alfajor Coco Dulce', '/uploads/CarruselInicio/AlfCocoDulce.png', 'Relleno de dulce de leche con cobertura de coco rallado.', 7500, 10, 0, ARRAY['Dulce de leche','Coco','Alfajores'], 'modalAlfCoco', 'Un delicioso alfajor relleno de dulce de leche cubierto por una capa de coco rallado. Dulzura y frescura en un solo bocado.', 'Alfajores'),
(4, 'Alfajor de Maicena', '/uploads/CarruselInicio/AlfMaicena.png', 'Galletas de maicena rellenas de dulce de leche y espolvoreadas con coco.', 6800, 10, 0, ARRAY['Maicena','Dulce de leche','Coco','Alfajores'], 'modalMaicena', 'Clásico alfajor argentino de maicena con dulce de leche y coco. Ideal para acompañar una merienda.', 'Alfajores'),
(5, 'Alfajor Chocolate Amargo', '/uploads/CarruselInicio/AlfChocoAmargo.png', 'Relleno de dulce de leche y bañado en chocolate 70%.', 8200, 10, 0, ARRAY['Chocolate amargo','Dulce de leche','Alfajores'], 'modalChocoAmargo', 'Para los amantes del chocolate intenso: alfajor relleno con dulce de leche y cobertura de chocolate amargo al 70%.', 'Alfajores'),
(6, 'Lemonpie', '/uploads/CarruselInicio/Lemonpie.png', 'Base de masa quebrada...', 12000, 5, 0, ARRAY['Limón','Merengue','Crema','Masa'], 'modalLemonpie', 'Base crocante...', 'Tortas'),
(7, 'Chocotorta', '/uploads/CarruselInicio/Chocotorta.png', 'Capas de galletitas de chocolate y crema de dulce de leche con queso crema.', 10000, 5, 0, ARRAY['Chocolate','Dulce de leche','Queso crema','Galletitas'], 'modalChocotorta', 'Capas de galletitas de chocolate y crema de dulce de leche con queso crema.', 'Tortas'),
(8, 'Torta Oreo', '/uploads/CarruselInicio/TortaOreo.png', 'Base húmeda de chocolate con crema de Oreo y cobertura crocante.', 11000, 5, 0, ARRAY['Oreo','Chocolate','Crema','Torta'], 'modalOreo', 'Torta húmeda con capas de crema de Oreo, base de chocolate y decoración crocante.', 'Tortas'),
(9, 'Selva Negra', '/uploads/CarruselInicio/SelvaNegra.png', 'Bizcochuelo de chocolate, cerezas y crema.', 10500, 5, 0, ARRAY['Chocolate','Cereza','Crema','Bizcochuelo'], 'modalSelva', 'Típica torta con capas de bizcochuelo de chocolate, cerezas y crema batida.', 'Tortas'),
(10, 'Tarta Frutal', '/uploads/CarruselInicio/TartaFrutal.png', 'Base de masa con crema pastelera y frutas frescas.', 9500, 5, 0, ARRAY['Frutas','Crema pastelera','Masa','Tarta'], 'modalFrutal', 'Tarta clásica con crema pastelera suave y frutas frescas de estación.', 'Tortas'),
(11, 'Tiramisú Clásico', '/uploads/CarruselInicio/Tiramisu.png', 'Bizcochuelo embebido en café con crema mascarpone.', 12500, 5, 0, ARRAY['Torta','Café','Mascarpone','Bizcochuelo','Cacao'], 'modalTiramisu', 'Delicado postre italiano con capas de bizcochuelo al café y suave crema mascarpone.', 'Tortas'),
(12, 'Red Velvet', '/uploads/CarruselInicio/RedVelvet.png', 'Bizcochuelo rojo aterciopelado con crema de queso.', 13000, 5, 0, ARRAY['Torta','Cacao','Colorante','Queso crema','Vainilla'], 'modalRedVelvet', 'Elegante torta de color rojo intenso con crema de queso suave, ideal para ocasiones especiales.', 'Tortas'),
(13, 'Cheesecake de Frutos Rojos', '/uploads/CarruselInicio/CheesecakeFrutosRojos.png', 'Base de galletitas con crema de queso y salsa de frutos rojos.', 13500, 5, 0, ARRAY['Torta','Queso crema','Frutillas','Arándanos','Galletitas'], 'modalCheesecakeRojos', 'Cheesecake suave y cremoso con un toque ácido de frutos rojos frescos.', 'Tortas'),
(14, 'Huevo Pascua Oreo', '/uploads/CarruselInicio/HuevoOreo.png', 'Chocolate relleno con oreo...', 15000, 5, 0, ARRAY['Chocolate','Oreo','Pascua'], 'modalHuevoOreo', 'Chocolate relleno de oreo...', 'Huevos'),
(15, 'Huevo Kinder', '/uploads/CarruselInicio/HuevoKinder.png', 'Chocolate con leche y centro cremoso estilo Kinder.', 16000, 5, 0, ARRAY['Chocolate con leche','Relleno cremoso','Kinder','Huevo de Pascua'], 'modalKinder', 'La textura suave del chocolate con leche y el sabor único del relleno tipo Kinder en forma de huevo.', 'Huevos'),
(16, 'Huevo Nutella', '/uploads/CarruselInicio/HuevoNutella.png', 'Chocolate relleno con crema Nutella y crocante de avellanas.', 17000, 5, 0, ARRAY['Nutella','Chocolate','Avellanas','Huevo de Pascua'], 'modalNutella', 'Relleno irresistible de Nutella con crocante de avellanas dentro de un cascarón de chocolate.', 'Huevos'),
(17, 'Cupcake Red Velvet', '/uploads/CarruselInicio/CupRedVelvet.png', 'Bizcocho rojo con frosting de queso crema.', 4500, 10, 0, ARRAY['Red velvet','Queso crema','Cupcake'], 'modalCupRed', 'Cupcake esponjoso de Red Velvet con un cremoso frosting de queso. Elegante y delicioso.', 'Cupcakes'),
(18, 'Cupcake de Vainilla y Dulce de Leche', '/uploads/CarruselInicio/CupcakeVainilla.png', 'Bizcochuelo de vainilla con corazón de dulce de leche.', 4000, 10, 0, ARRAY['Vainilla','Dulce de leche','Cupcake','Mini torta'], 'modalCupVainilla', 'Delicioso y suave bizcochuelo con relleno de dulce de leche y cobertura cremosa.', 'Cupcakes'),
(19, 'Cupcake de Limón y Amapola', '/uploads/CarruselInicio/CupcakeLimon.png', 'Bizcochuelo cítrico con semillas de amapola y glaseado.', 4200, 10, 0, ARRAY['Limón','Amapola','Glaseado','Cupcake'], 'modalCupLimon', 'Suave bizcochuelo con notas cítricas y textura única, ideal para la merienda.', 'Cupcakes'),
(20, 'Cupcake de Chocolate Intenso', '/uploads/CarruselInicio/CupcakeChoco.png', 'Bizcochuelo de cacao amargo con ganache de chocolate.', 4300, 10, 0, ARRAY['Chocolate','Ganache','Cacao amargo','Cupcake'], 'modalCupChoco', 'Perfecto para amantes del chocolate: sabor intenso y textura húmeda.', 'Cupcakes'),
(21, 'Brownie con Nueces', '/uploads/CarruselInicio/BrownieNuez.png', 'Brownie de chocolate con trozos de nuez crocante.', 8500, 10, 0, ARRAY['Chocolate','Nueces','Brownie'], 'modalBrownieNuez', 'Clásico brownie húmedo con trozos de nuez. Perfecto para los amantes del chocolate y lo crocante.', 'Especiales'),
(22, 'Budín de Limón', '/uploads/CarruselInicio/BudinLimon.png', 'Bizcochuelo húmedo con ralladura y glaseado de limón.', 6000, 10, 0, ARRAY['Budín','Limón','Glaseado','Horneado'], 'modalBudinLimon', 'Budín casero con intenso sabor a limón y cobertura glaseada.', 'Especiales'),
(23, 'Cookies Triple Chocolate', '/uploads/CarruselInicio/CookiesTriple.png', 'Galletas con chips de chocolate blanco, negro y con leche.', 5500, 10, 0, ARRAY['Galletitas','Chocolate','Cookies','Horneado'], 'modalCookiesTriple', 'Galletas crujientes por fuera y suaves por dentro, con explosión de chocolates.', 'Especiales'),
(24, 'Cheesecake en Frasco', '/uploads/CarruselInicio/CheesecakeFrasco.png', 'Crema de queso, base de galletitas y frutos rojos en frasco.', 6500, 10, 0, ARRAY['Queso crema','Frutillas','Postre individual','Frasco'], 'modalFrasco', 'Versión práctica y deliciosa del cheesecake para llevar, en frasco de vidrio reutilizable.', 'Especiales'),
(25, 'Bombón de Dulce de Leche', '/uploads/CarruselInicio/BombonDDL.png', 'Chocolate con corazón de dulce de leche cremoso.', 3500, 10, 0, ARRAY['Chocolate','Dulce de leche','Bombón'], 'modalBombonDDL', 'Pequeño placer relleno de dulce de leche artesanal, cubierto con chocolate semiamargo.', 'Bombones'),
(26, 'Bombón de Maracuyá', '/uploads/CarruselInicio/BombonMaracuya.png', 'Relleno frutal ácido con cobertura de chocolate blanco.', 3700, 10, 0, ARRAY['Maracuyá','Chocolate blanco','Bombón','Frutal'], 'modalBombonMaracuya', 'Explosión tropical de sabor con maracuyá fresco y cobertura blanca.', 'Bombones'),
(27, 'Bombón Crocante de Avellanas', '/uploads/CarruselInicio/BombonAvellana.png', 'Relleno de praliné y centro crocante de avellana.', 3900, 10, 0, ARRAY['Avellanas','Praliné','Chocolate','Bombón'], 'modalBombonAvellana', 'Inspirado en los clásicos bombones europeos: textura crocante y sabor a nuez.', 'Bombones');

ALTER TABLE orders
ADD COLUMN state TEXT DEFAULT 'pendiente' CHECK (state IN (
  'pendiente',
  'confirmado',
  'en_preparacion',
  'enviado',
  'entregado',
  'cancelado',
  'devuelto'
));

\d orders

SELECT setval('products_id_seq', (SELECT MAX(id) FROM "products"));

CREATE TABLE IF NOT EXISTS CartItems (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES Products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE orders ADD COLUMN total NUMERIC(12,2) DEFAULT 0;