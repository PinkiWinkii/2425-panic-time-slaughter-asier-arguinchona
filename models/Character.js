const mongoose = require('mongoose');

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
    saddlebag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Saddlebags' }],
    quiver: Number,
    weapons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Weapons' }],
    pouch: {
      coins: Number,
      gold: Number,
      precious_stones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreciousStones' }]
    },
    miscellaneous: []
  }
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;