import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { wss } from './websocket.js';
import bodyParser from 'body-parser';
import router from './routes/index.routes.js';
import bcrypt from 'bcryptjs';
import { pool } from './databases/db.js';

dotenv.config();

const app = express();
const server = http.createServer(app);


app.use(cors({
  origin: 'https://web2iua.onrender.com',
  credentials: true // si necesitas enviar cookies o cabeceras de autenticación
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router); // Usar el router para manejar las rutas de la API
//app.use(router);

/*
app.post('/cargaradmin', async (req, res) => {
  try {
      const username = "newbyteAdmin";
      const email = "icnewbyte@gmail.com";
      const password = "141322";
      const role = "admin";
      const departmentLetter = "AZ";
      const phoneNumber = 1234567890;
      const floorNumber = 10;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserción en la base de datos para PostgreSQL
      const result = await pool.query(
          `INSERT INTO Users (username, email, password, role, department_letter, phone_number, floor_number) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [username, email, hashedPassword, role, departmentLetter, phoneNumber, floorNumber]
      );

      return res.json({ message: "Usuario creado correctamente", userId: result.rows[0].id });
  } catch (error) {
      console.error('Error al crear el usuario:', error);
      
      // Mostrar más información en la respuesta para debugging
      return res.status(500).json({ 
          message: "Error en el servidor", 
          error: error.message || 'No se pudo determinar el error',
          stack: error.stack || 'Sin stack disponible'
      });
  }
});

app.get('/cargartablas', (req, res) => {
  // Consulta para crear la tabla Users
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) CHECK (role IN ('admin', 'client')) DEFAULT 'client',
      department_number INT NOT NULL,
      floor_letter VARCHAR(255) NOT NULL,
      phone_number VARCHAR(255) NOT NULL
    );
  `;

  // Consulta para crear la tabla Calls
  const createCallsTable = `
    CREATE TABLE IF NOT EXISTS Calls (
      id SERIAL PRIMARY KEY,
      depto VARCHAR(255) NOT NULL,
      floor_letter VARCHAR(255) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      visitor_phone_number VARCHAR(255) NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Ejecutar las consultas secuencialmente
  pool.query(createUsersTable, (err, result) => {
    if (err) {
      console.error('Error al crear la tabla Users:', err.message);
      return res.status(500).json({ message: 'Error al crear la tabla Users', error: err.message });
    }

    console.log('Tabla Users creada correctamente:', result);

    // Crear tabla Calls después de haber creado Users
    pool.query(createCallsTable, (err, result) => {
      if (err) {
        console.error('Error al crear la tabla Calls:', err.message);
        return res.status(500).json({ message: 'Error al crear la tabla Calls', error: err.message });
      }

      console.log('Tabla Calls creada correctamente:', result);
      res.status(200).json({ message: 'Tablas creadas correctamente' });
    });
  });
});

app.post('/mostrarDatos', async (req, res) => {
  try {
    // Consultar todos los usuarios
    const usersResult = await pool.query('SELECT * FROM Users');
    
    // Consultar todas las llamadas
    const callsResult = await pool.query('SELECT * FROM Calls');
    
    // Devolver los datos de ambas tablas
    return res.json({
      message: "Datos obtenidos correctamente",
      users: usersResult.rows,  // Los usuarios
      calls: callsResult.rows   // Las llamadas
    });
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    
    return res.status(500).json({
      message: "Error en el servidor",
      error: error.message || 'No se pudo determinar el error',
      stack: error.stack || 'Sin stack disponible'
    });
  }
});
 */
router.get('/pingFront', (req, res) => {
  res.status(200).send('pong');
});

app.get('/ping', (req, res) => {
  pool.query('SELECT 1', (err, result) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos:', result);
    }
  });
});

// Manejar todas las demás rutas con una respuesta 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Recurso no se encontro encontrado' });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Iniciar el servidor
server.listen(process.env.PORT || 5002, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT || 5002}`);
});
