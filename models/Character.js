const mongoose = require('mongoose');
const SaddleBag = require('./SaddleBag');
const Weapon = require('./Weapon');
const PreciousStone = require('./PreciousStone');

const characterSchema = new mongoose.Schema({
  name: String,
  occupation: String,
  description: String,
  stats: {
    strength: Number,
    dexterity: Number,
    stamina: Number
  },
  equipment: {
    saddlebag: [{ type: mongoose.Schema.Types.ObjectId, ref: SaddleBag }],
    quiver: Number,
    weapons: [{ type: mongoose.Schema.Types.ObjectId, ref: Weapon }],
    pouch: {
      coins: Number,
      gold: Number,
      precious_stones: [{ type: mongoose.Schema.Types.ObjectId, ref: PreciousStone }]
    },
    miscellaneous: []
  }
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;