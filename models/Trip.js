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
  startCoordinates: {
    lat: Number,
    lng: Number
  },
  endPoint: {
    type: String,
    required: true
  },
  endCoordinates: {
    lat: Number,
    lng: Number
  },
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
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
  duration: String,
  distance: String
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
