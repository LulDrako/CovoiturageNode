const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    model: {
      type: String,
      required: [true, 'Le modèle de la voiture est requis.'],
      trim: true
    },
    seats: {
      type: Number,
      required: [true, 'Le nombre de sièges est requis.'],
      min: [1, 'Il doit y avoir au moins un siège.']
    },
    plate: {
      type: String,
      required: [true, 'La plaque d\'immatriculation est requise.'],
      trim: true,
    },
    horsepower: {
      type: Number,
      required: [true, 'La puissance du moteur est requise.']
    },
    engine: {
      type: String,
      required: [true, 'Le type de moteur est requis.'],
      enum: ['Essence', 'Diesel', 'Électrique', 'Hybride'],
    },
    image: {
      type: String,
      required: [true, 'L\'URL de l\'image est requise.']
    }
  });
  
  const Car = mongoose.model('Car', carSchema);
  
  module.exports = Car;
  