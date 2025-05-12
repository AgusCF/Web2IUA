CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    img TEXT,
    description TEXT,
    price NUMERIC(10, 2),
    stock INTEGER,
    offert NUMERIC(3, 1) DEFAULT 0,  -- Descuento en porcentaje
    tags TEXT[]  -- Array de palabras clave
);
/* 
INSERT INTO productos (name, img, description, price, stock, tags)
VALUES (
  'Zapatillas deportivas',
  'https://miweb.com/imagenes/zapatillas.jpg',
  'Zapatillas para running con suela antideslizante.',
  79.99,
  50,
  ARRAY['deporte', 'running', 'hombre']
);
 */