const mongoose = require('mongoose');
const { validatePlate, formatPlate } = require('../utils/validators');

const carSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    model: {
        type: String,
        required: [true, 'Le modèle de la voiture est requis.'],
        trim: true,
        maxlength: [50, 'Le modèle ne peut pas dépasser 50 caractères.']
    },
    seats: {
        type: Number,
        required: true,
        min: 1,
        max: 9
    },
    plate: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    horsepower: {
        type: Number,
        required: true,
        min: 1,
        max: 999
    },
    engine: {
        type: String,
        required: true,
        enum: ['Essence', 'Diesel', 'Électrique', 'Hybride']
    },
    image: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    }
});

// ✅ Middleware pour formater et valider la plaque
carSchema.pre('save', function(next) {
    if (this.plate) {
        this.plate = formatPlate(this.plate);
        if (!validatePlate(this.plate)) {
            return next(new Error('Format de plaque invalide. Exemple : AA-123-AA'));
        }
    }
    next();
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
