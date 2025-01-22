const mongoose = require('mongoose');

const SaddleBagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  recover_stamina: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('SaddleBag', SaddleBagSchema);
