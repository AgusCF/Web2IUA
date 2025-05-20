# Local
-- Crear la base de datos (PostgreSQL no tiene "IF NOT EXISTS" para CREATE DATABASE al ejecutar desde el mismo cliente)
-- Si es necesario, puedes hacerlo manualmente o con un bloque condicional PL/pgSQL
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'portero_virtual_qr') THEN
      CREATE DATABASE portero_virtual_qr;
   END IF;
END
$$;

-- Cambiar al contexto de la base de datos
-- En PostgreSQL, debes conectarte a la base de datos con otro comando desde tu cliente (por ejemplo, `\c portero_virtual_qr` en psql).

-- Crear las tablas
CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('admin', 'resident')) DEFAULT 'resident',
  department_number INT NOT NULL,
  floor_letter INT NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  priority_level INT CHECK (priority_level >= 1 AND priority_level <= 3) DEFAULT 1
);

CREATE TABLE Calls (
  id SERIAL PRIMARY KEY,
  depto VARCHAR(255) NOT NULL,
  floor_letter INT NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  visitor_phone_number VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mostrar las tablas
\dt

-- Mostrar la estructura de las tablas
\d Users
\d Calls

ALTER TABLE Users 
ADD COLUMN priority_level INT CHECK (priority_level >= 1 AND priority_level <= 4) DEFAULT 1;
UPDATE Users
SET priority_level = 4
WHERE email = 'newbyteAdmin@correo.com';

-- Eliminar todos los registros de la tabla y reiniciar la secuencia de IDs
TRUNCATE TABLE Calls RESTART IDENTITY;
