const express = require('express');
const dotenv = require('dotenv');
const router = require('./routes/index.routes.js');
dotenv.config();

const app = express();

app.use('/', router);

// Iniciar el servidor
app.listen(process.env.PORT || 3500, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT || 3500}`);
  });
