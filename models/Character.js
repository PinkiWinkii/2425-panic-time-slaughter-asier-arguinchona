const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  id: {
    type: String, // Identificador único
    required: true,
    unique: true
  },
  username: {
    type: String, // Nombre de usuario único
    required: true,
    unique: true
  }
});

const Character = mongoose.model('Character', characterSchema);

module.exports = User;