const express = require('express');
const dotenv = require('dotenv');
const router = require('./src/routes/index.routes.js');
dotenv.config();

// Configuración de Express
const server = express();
server.use('/api', router);

// Iniciar el servidor
server.listen(process.env.PORT || 3500, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT || 3500}`);
  });
