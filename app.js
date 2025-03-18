const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const favicon = require('serve-favicon');
const User = require('./models/User');
const Car = require('./models/Car');
const Trip = require('./models/Trip');
require('dotenv').config();
const axios = require('axios');


const app = express();

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(session({
  secret: 'une_chaine_secrete_complexe',
  resave: false,
  saveUninitialized: false,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  if (req.session.userId) {
    const redirectPath = req.session.role === 'driver' ? '/driverHome' : '/passengerHome';
    res.redirect(redirectPath);
  } else {
    res.render('home', { title: 'Bienvenue' });
  }
});

app.get('/users/signup', function(req, res) {
  res.render('signup');
});

app.get('/users/login', function(req, res) {
    res.render('login');
});

app.get('/reglement', function(req, res) {
  res.render('reglement');
});

app.post('/reserve-trip', isAuthenticated, async (req, res) => {
  const { tripId } = req.body;

  res.status(200).send(); 
});

app.get('/payment', isAuthenticated, async (req, res) => {
  const { tripId } = req.query; 
  res.render('payment', { tripId });
});


app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});


app.post('/create-trip', isAuthenticated, async function(req, res) {
  const { carId, startPoint, endPoint, price, additionalInfo } = req.body;

  try {
    if (!carId) {
      return res.status(400).json({ error: 'Car ID is required' });
    }

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${startPoint}&destination=${endPoint}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    
    if (!response.data || !response.data.routes || response.data.routes.length === 0) {
      return res.status(404).json({ error: 'No routes found' });
    }

    const route = response.data.routes[0];

    if (!route.legs || route.legs.length === 0) {
      return res.status(404).json({ error: 'No legs found in the route' });
    }

    const duration = route.legs[0].duration.text;
    const distance = route.legs[0].distance.text;

    const trip = new Trip({
      driver: req.user._id,
      car: car._id, 
      startPoint: startPoint,
      endPoint: endPoint,
      departureTime: new Date(),
      seatsAvailable: car.seats,
      price: price,
      additionalInfo: additionalInfo,
      duration: duration,
      distance: distance
    });

    await trip.save();

    res.json({ message: 'Trip created successfully', trip });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/trips/:id/delete', isAuthenticated, async (req, res) => {
  try {
      const result = await Trip.findByIdAndDelete(req.params.id);
      if (!result) {
          return res.status(404).send("Trip not found");
      }
      res.redirect('/driverHome'); 
  } catch (error) {
      console.error('Error deleting trip:', error);
      res.status(500).send("Internal server error");
  }
});




app.get('/driverHome', isAuthenticated, async function(req, res) {
  if (req.user.role === 'driver') {
    try {
      const cars = await Car.find();
      const trips = await Trip.find({ driver: req.user._id }).populate('car');
      

      res.render('driverHome', {
        title: 'Espace Conducteur',
        user: req.user,
        cars: cars,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        trips: trips,
      });
    } catch (error) {
      console.error('Error retrieving cars:', error);
      res.status(500).send("Internal server error.");
    }
  } else {
    res.redirect('/passengerHome');
  }
});



app.get('/passengerHome', isAuthenticated, async function(req, res) {
  if(req.user.role === 'passenger') {
    try {
      const trips = await Trip.find().populate('car');
      res.render('passengerHome', {
        title: 'Espace Passager',
        user: req.user,
        trips: trips
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des trajets:', error);
      res.status(500).send("Erreur interne du serveur.");
    }
  } else {
    res.redirect('/driverHome');
  }
});
app.post("/users/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log("Inscription reçue pour :", username, "avec le rôle", role);
 
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Le nom d'utilisateur ou l'email est déjà pris." });
    }
 
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await new User({
      username,
      email,
      hashedPassword,
      role,
    }).save();
 
    req.session.userId = user._id;
    req.session.role = user.role;
 
    const redirectPath =
      user.role === "driver" ? "/driverHome" : "/passengerHome";
 
    res.json({ message: "Inscription réussie", redirect: redirectPath });
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'inscription. Veuillez réessayer." });
  }
});
 
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Tentative de connexion avec email:", email);
  console.log("Données de connexion reçues:", { email, password });
 
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      console.log("Aucun utilisateur trouvé avec cet email:", email);
      return res.status(401).send("Email ou mot de passe incorrect.");
    }
 
    console.log("Mot de passe soumis (clair):", password);
    console.log("Mot de passe stocké (haché):", user.hashedPassword);
 
    const isMatch = user.comparePassword(password);
    console.log("Le mot de passe correspond-il ?:", isMatch);
 
    if (isMatch) {
      req.session.userId = user._id;
      req.session.role = user.role;
      console.log("Connexion réussie pour:", user.username);
      res.redirect(user.role === "driver" ? "/driverHome" : "/passengerHome");
    } else {
      console.log("Mot de passe incorrect pour:", email);
      res.status(401).send("Email ou mot de passe incorrect.");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).send("Erreur interne du serveur.");
  }
});

// app.js
app.post('/process-payment', isAuthenticated, async (req, res) => {
  // ... your payment processing logic ...

  if (paymentSuccessful) {
    res.json({ success: true, message: 'Paiement confirmé.' });
  } else {
    res.json({ success: false, message: 'Paiement échoué.' });
  }
});



async function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        try {
            const userFromDb = await User.findById(req.session.userId);
            console.log('Utilisateur trouvé:', userFromDb);
            if (!userFromDb) {
                req.session.destroy(() => res.redirect('/login'));
                return;
            }
            req.user = userFromDb;
            next();
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            res.status(500).send("Erreur interne du serveur.");
        }
    } else {
        res.redirect('/login');
    }
}

module.exports = app;
