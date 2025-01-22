const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  num_die_damage: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  quality: {
    type: Number,
    required: true
  }
});

const Weapon = mongoose.model('Weapon', weaponSchema);

module.exports = Weapon;
