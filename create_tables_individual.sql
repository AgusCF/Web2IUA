-- Queries individuales para crear cada tabla por separado

-- ===============================================
-- TABLA USERS
-- ===============================================
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

-- Índices para búsquedas por teléfono y email
CREATE INDEX idx_users_tel ON Users(tel);
CREATE INDEX idx_users_email ON Users(email);

-- Verificar creación de tabla Users
SELECT * FROM information_schema.tables WHERE table_name = 'users';

-- ===============================================
-- TABLA PRODUCTS
-- ===============================================
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

-- Índice para búsquedas por categoría
CREATE INDEX idx_products_category ON Products(category);

-- Verificar creación de tabla Products
SELECT * FROM information_schema.tables WHERE table_name = 'products';

-- ===============================================
-- TABLA FAVORITES
-- ===============================================
CREATE TABLE Favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

-- Índices para mejor rendimiento en joins
CREATE INDEX idx_favorites_user_id ON Favorites(user_id);
CREATE INDEX idx_favorites_product_id ON Favorites(product_id);

-- Verificar creación de tabla Favorites
SELECT * FROM information_schema.tables WHERE table_name = 'favorites';

-- ===============================================
-- VERIFICACIONES FINALES
-- ===============================================

-- Ver todas las tablas creadas
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Ver columnas de cada tabla
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'products', 'favorites')
ORDER BY table_name, ordinal_position;
