import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { wss } from './websocket.js';
import bodyParser from 'body-parser';
import router from './routes/index.routes.js';
import { pool } from './databases/db.js';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  }
});
const upload = multer({ storage });

app.use(cors({
  origin: 'https://web2iua.onrender.com',
  credentials: true // si necesitas enviar cookies o cabeceras de autenticación
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router); // Usar el router para manejar las rutas de la API

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

// Ruta para subir imágenes de productos
app.post('/api/products/upload', upload.single('imagen'), (req, res) => {
  console.log('Archivo recibido:', req.file);
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ninguna imagen' });
  }
  // Devuelve la URL de la imagen subida
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Servir la carpeta de imágenes como estática
app.use('/uploads', express.static('uploads'));

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
