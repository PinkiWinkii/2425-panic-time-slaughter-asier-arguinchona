const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
  day_number: {
    type: Number,
    required: true
  },
  day_week: {
    type: String,
    required: true
  },
  km_traveled: {
    type: Number,
    required: true
  },
  km_total: {
    type: Number,
    required: true
  }
});

const Time = mongoose.model('Time', timeSchema);

module.exports = Time;
