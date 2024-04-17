const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startLocation: String,
    endLocation: String,
    startTime: Date,
    estimatedEndTime: Date,
    // Include other fields relevant to the trip
});

module.exports = mongoose.model('Trip', tripSchema);
