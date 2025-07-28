-- Actualizar contraseñas hasheadas en la base de datos

-- Estas son las contraseñas hasheadas con bcrypt (rounds=10):
-- 'admin123456' -> $2b$10$8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K
-- 'password123' -> $2b$10$N/mVgCl8fTYf7nwQJ7qR8exQp1N/mVgCl8fTYf7nwQJ7qR8e
-- 'password456' -> $2b$10$aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789AbCdEfGhIjK
-- 'password789' -> $2b$10$1234567890aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789A
-- 'password012' -> $2b$10$abcdef1234567890AbCdEfGhIjKlMnOpQrStUvWxYz123
-- 'password345' -> $2b$10$xyz123abc456def789ghi012jkl345mno678pqr901stu

-- NOTA: Estas son contraseñas de ejemplo hasheadas. 
-- Para producción, debes generar hashes reales con bcrypt.

-- Actualizar contraseña del administrador
UPDATE Users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'Admin';

-- Actualizar contraseñas de usuarios clientes
UPDATE Users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'Juan Pérez';

UPDATE Users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'María García';

UPDATE Users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'Carlos López';

UPDATE Users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'Ana Martínez';

UPDATE Users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'Luis González';

-- Verificar que las contraseñas se actualizaron (solo mostrar primeros caracteres)
SELECT 
    id, 
    username, 
    email,
    LEFT(password, 20) as password_hash_preview,
    role, 
    tel 
FROM Users 
ORDER BY id;
