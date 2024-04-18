const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startLocation: String,
  endLocation: String,
  startTime: Date,
  estimatedEndTime: Date,
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;