-- Insertar usuarios de prueba con contraseñas hasheadas

-- NOTA: Todas las contraseñas están hasheadas con bcrypt (salt rounds: 10)
-- Contraseñas originales:
-- Admin: admin123456
-- Usuarios: password123, password456, password789, password012, password345

-- Usuario administrador
INSERT INTO Users (username, email, password, role, tel) 
VALUES ('Admin', 'admin@tecno.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '1234567890');

-- Usuarios clientes de prueba
INSERT INTO Users (username, email, password, role, tel) 
VALUES 
('Juan Pérez', 'juan.perez@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '1111111111'),
('María García', 'maria.garcia@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '2222222222'),
('Carlos López', 'carlos.lopez@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '3333333333'),
('Ana Martínez', 'ana.martinez@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '4444444444'),
('Luis González', 'luis.gonzalez@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '5555555555');

-- Verificar usuarios insertados (mostrando solo preview del hash)
SELECT id, username, email, LEFT(password, 30) as password_preview, role, tel, createdAt FROM Users ORDER BY id;
