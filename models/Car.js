const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    model: {
        type: String,
        required: [true, 'Le modèle de la voiture est requis.'],
        trim: true,
        maxlength: [50, 'Le modèle ne peut pas dépasser 50 caractères.']
    },
    seats: {
        type: Number,
        required: [true, 'Le nombre de sièges est requis.'],
        min: [1, 'Il doit y avoir au moins un siège.'],
        max: [9, 'Le nombre de sièges ne peut pas dépasser 9.']
    },
    plate: {
        type: String,
        required: [true, 'La plaque d\'immatriculation est requise.'],
        trim: true,
        unique: true,
        index: true
    },
    horsepower: {
        type: Number,
        required: [true, 'La puissance du moteur est requise.'],
        min: [1, 'La puissance doit être au moins de 1.'],
        max: [999, 'La puissance maximale est de 999 chevaux.']
    },
    engine: {
        type: String,
        required: [true, 'Le type de moteur est requis.'],
        enum: ['Essence', 'Diesel', 'Électrique', 'Hybride']
    },
    image: {
        type: String,
        required: true, // L'URL de l'image doit être obligatoire pour éviter les erreurs d'affichage
        trim: true,
        maxlength: [500, 'L\'URL de l\'image est trop longue.']
    }
});

// 📌 Middleware pour **formater automatiquement** la plaque AVANT de la sauvegarder
carSchema.pre('save', function(next) {
    if (this.plate) {
        let rawPlate = this.plate.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Convertit en majuscules et enlève les caractères spéciaux

        if (rawPlate.length === 7) {
            this.plate = `${rawPlate.slice(0, 2)}-${rawPlate.slice(2, 5)}-${rawPlate.slice(5)}`;
        } else {
            return next(new Error('Format de plaque invalide. Exemple : AA-123-AA'));
        }
    }
    next();
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
