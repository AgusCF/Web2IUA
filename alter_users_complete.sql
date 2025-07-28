-- Script completo para modificar tabla Users existente

-- OPCIÓN 1: Si la tabla está vacía o no te importa recrearla
-- =====================================================
/*
DROP TABLE IF EXISTS Favorites CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

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

CREATE INDEX idx_users_tel ON Users(tel);
CREATE INDEX idx_users_email ON Users(email);
*/

-- OPCIÓN 2: Si la tabla tiene datos y quieres conservarlos
-- ======================================================

-- Paso 1: Verificar estructura actual
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public';

-- Paso 2: Agregar columna email (permitiendo NULL temporalmente)
ALTER TABLE Users ADD COLUMN IF NOT EXISTS email TEXT;

-- Paso 3: Rellenar emails temporales para usuarios existentes
UPDATE Users 
SET email = CASE 
    WHEN username = 'Admin' THEN 'admin@tecno.com'
    WHEN tel = '1111111111' THEN 'juan.perez@email.com'
    WHEN tel = '2222222222' THEN 'maria.garcia@email.com'
    WHEN tel = '3333333333' THEN 'carlos.lopez@email.com'
    WHEN tel = '4444444444' THEN 'ana.martinez@email.com'
    WHEN tel = '5555555555' THEN 'luis.gonzalez@email.com'
    ELSE CONCAT('user', id, '@temp.com')
END
WHERE email IS NULL;

-- Paso 4: Verificar que todos los usuarios tengan email
SELECT id, username, email, tel FROM Users WHERE email IS NULL;

-- Paso 5: Hacer la columna NOT NULL
ALTER TABLE Users ALTER COLUMN email SET NOT NULL;

-- Paso 6: Agregar restricción de unicidad
ALTER TABLE Users ADD CONSTRAINT unique_users_email UNIQUE (email);

-- Paso 7: Crear índice para búsquedas
CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email);

-- Paso 8: Verificar estructura final
\d Users

-- Paso 9: Ver usuarios actualizados
SELECT id, username, email, role, tel, createdat FROM Users ORDER BY id;

-- OPCIÓN 3: Query individual para ejecutar paso a paso
-- ===================================================

-- Ejecuta cada línea por separado si tienes problemas:

-- ALTER TABLE Users ADD COLUMN email TEXT;
-- UPDATE Users SET email = 'admin@tecno.com' WHERE username = 'Admin';
-- UPDATE Users SET email = 'user1@temp.com' WHERE id = 1 AND email IS NULL;
-- UPDATE Users SET email = 'user2@temp.com' WHERE id = 2 AND email IS NULL;
-- ALTER TABLE Users ALTER COLUMN email SET NOT NULL;
-- ALTER TABLE Users ADD CONSTRAINT unique_users_email UNIQUE (email);
-- CREATE INDEX idx_users_email ON Users(email);
