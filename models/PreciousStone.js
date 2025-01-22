const mongoose = require('mongoose');

const preciousStoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

const PreciousStone = mongoose.model('PreciousStone', preciousStoneSchema);

module.exports = PreciousStone;
