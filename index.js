require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

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
        // console.log('Characters:', response.data);
        
        
      } catch (error) {
        console.error('Error fetching characters:', error.message);
      }

      try {

        const timeResponse = await axios.get(`http://localhost:${PORT}/getTimes`);
        console.log('Times:', timeResponse.data);
        
        
      } catch (error) {
        console.error('Error fetching times:', error.message);
      }

      try {
        const newTime = {
          "day_number": 4,
          "day_week": "Wednesday",
          "km_traveled": 5,
          "km_total": 12
        }

        const postTimeResponse = await axios.post(`http://localhost:${PORT}/postTime`, { time: newTime });
        console.log('POSTT TIME RESPONSE');
        console.log(postTimeResponse.data);
      } catch (error) {
        console.error('Error posting times:', error.message);
      }
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });