-- Consulta para modificar la tabla Users existente agregando el campo email

-- 1. Agregar la columna email (inicialmente permitiendo NULL)
ALTER TABLE Users ADD COLUMN email TEXT;

-- 2. Agregar un email temporal a los usuarios existentes para evitar conflictos
UPDATE Users SET email = CONCAT('user', id, '@temp.com') WHERE email IS NULL;

-- 3. Cambiar la columna para que no permita NULL
ALTER TABLE Users ALTER COLUMN email SET NOT NULL;

-- 4. Agregar la restricción de unicidad
ALTER TABLE Users ADD CONSTRAINT unique_email UNIQUE (email);

-- 5. Crear índice para búsquedas rápidas por email
CREATE INDEX idx_users_email ON Users(email);

-- 6. Verificar la estructura actualizada de la tabla
\d Users

-- 7. Ver los usuarios con sus emails temporales
SELECT id, username, email, role, tel FROM Users ORDER BY id;

-- 8. (Opcional) Actualizar emails con valores reales
-- Puedes ejecutar estas queries individualmente para actualizar emails específicos:
/*
UPDATE Users SET email = 'admin@tecno.com' WHERE username = 'Admin';
UPDATE Users SET email = 'juan.perez@email.com' WHERE username = 'Juan Pérez';
UPDATE Users SET email = 'maria.garcia@email.com' WHERE username = 'María García';
-- ... etc
*/
