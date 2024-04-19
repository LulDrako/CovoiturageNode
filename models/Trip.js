const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  startPoint: {
    type: String,
    required: true
  },
  endPoint: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  seatsAvailable: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  additionalInfo: String,
  duration: String, // Durée du trajet (ex: "2 hours 30 mins")
  distance: String // Distance du trajet (ex: "150 km")
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
