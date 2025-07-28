-- Consultas para crear las tablas de la base de datos

-- Eliminar tablas si existen (para empezar limpio)
DROP TABLE IF EXISTS Favorites CASCADE;
DROP TABLE IF EXISTS Products CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

-- 1. Crear tabla Users
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'client')) DEFAULT 'client',
    tel TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear tabla Products
CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price VARCHAR(50) NOT NULL,
    imageUrl TEXT,
    category VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crear tabla Favorites
CREATE TABLE Favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id) -- Evitar duplicados de favoritos
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_favorites_user_id ON Favorites(user_id);
CREATE INDEX idx_favorites_product_id ON Favorites(product_id);
CREATE INDEX idx_products_category ON Products(category);
CREATE INDEX idx_users_tel ON Users(tel);
CREATE INDEX idx_users_email ON Users(email);

-- Verificar que las tablas se crearon correctamente
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'products', 'favorites');

-- Mostrar estructura de cada tabla
\d Users
\d Products
\d Favorites
