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
import fs from 'fs';
import sharp from 'sharp';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
});

// Antes de configurar multer o usar la carpeta uploads:
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

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


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ruta para subir imágenes de productos
app.post('/api/products/upload', upload.single('imagen'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ninguna imagen' });
  }

  const inputPath = req.file.path;
  const outputPath = `uploads/opt_${Date.now()}.webp`; // Cambiar la extensión a .webp

  try {
    // Optimiza la imagen (ajusta calidad y tamaño según tus necesidades)
    await sharp(inputPath)
      .resize({ width: 600 }) // Reducir el ancho máximo a 600px
      .toFormat('webp', { quality: 60 }) // Convertir a WebP con calidad 60
      .toFile(outputPath);

    // Elimina el archivo original si quieres ahorrar espacio
    fs.unlinkSync(inputPath);

    res.json({ imageUrl: `/uploads/${path.basename(outputPath)}` });
  } catch (err) {
    console.error('Error al optimizar imagen:', err);
    res.status(500).json({ message: 'Error al procesar la imagen' });
  }
});

//  Se quita para que las imagenes funcionen optimizadas
// Servir la carpeta de imágenes como estática
//app.use('/uploads', express.static('uploads'));

// Nueva ruta para acceder a las imágenes
app.get('/uploads/:filename', async (req, res, next) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  // Si ya existe la versión optimizada, la servimos
  if (filename.startsWith('opt_')) {
    return res.sendFile(filePath, { root: '.' });
  }

  // Si la imagen no es .webp, la convertimos al vuelo
  try {
    const stats = fs.statSync(filePath);
    if (!filename.endsWith('.webp')) {
      const webpFilePath = filePath.replace(path.extname(filePath), '.webp');
      await sharp(filePath)
        .resize({ width: 600 }) // Reducir el ancho máximo a 600px
        .toFormat('webp', { quality: 80 }) // Convertir a WebP con calidad 80
        .toFile(webpFilePath);

      return res.sendFile(webpFilePath, { root: '.' });
    } else {
      return res.sendFile(filePath, { root: '.' });
    }
  } catch (err) {
    next();
  }
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
