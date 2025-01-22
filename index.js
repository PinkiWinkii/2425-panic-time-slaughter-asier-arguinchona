require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Rutas
app.use('/', routes);

// Conexión a MongoDB 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);

      // Llamar a la ruta de characters y imprimir en consola
      try {
        const response = await axios.get(`http://localhost:${PORT}/characters`);
        console.log('Characters:', response.data);
      } catch (error) {
        console.error('Error fetching characters:', error.message);
      }
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });