const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Car = require('./models/Car');
const Trip = require('./models/Trip');
require('dotenv').config();
const axios = require('axios');
const { getCoordinates, isWithinRadius } = require('./utils/geolocation');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const isAuthenticatedJWT = require('./middlewares/isAuthenticatedJWT');
const { validateEmail, validatePassword } = require('./utils/validators');





const app = express();

const mongoURL = process.env.MONGO_URL

mongoose.connect(mongoURL)
  .then(() => console.log(`✅ MongoDB connecté avec l'URL: ${process.env.NODE_ENV === 'production' ? "[HIDDEN]" : mongoURL}`))
  .catch(err => {
    console.error("❌ Erreur de connexion MongoDB:", err);
    process.exit(1);
  });


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.get('/', function(req, res) {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const redirectPath = decoded.role === 'driver' ? '/driverHome' : '/passengerHome';
      return res.redirect(redirectPath);
    } catch (err) {
      console.error('Token invalide :', err);
      res.clearCookie('token');
    }
  }

  res.render('home', { title: 'Bienvenue sur KovoitGo', pageCss: 'home' });
});


app.get('/users/signup', function(req, res) {
  const token = req.cookies.token;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const redirectPath = decoded.role === 'driver' ? '/driverHome' : '/passengerHome';
      return res.redirect(redirectPath); // 🔁 Redirection si déjà connecté
    } catch (err) {
      console.error('Token invalide :', err);
      res.clearCookie('token'); // 🔒 Token cassé = on le supprime
    }
  }

  res.render('signup', { title: 'Inscription - KovoitGo', pageCss: 'signup' });
});


app.get('/users/login', function(req, res) {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const redirectPath = decoded.role === 'driver' ? '/driverHome' : '/passengerHome';
      return res.redirect(redirectPath);  // ✅ Redirige s’il est déjà connecté
    } catch (err) {
      console.error('Token invalide :', err);
      res.clearCookie('token'); // ❌ On supprime le token s’il est corrompu
    }
  }

  res.render('login', { title: 'Connexion - KovoitGo', pageCss: 'login' });
});


app.get('/reglement', function(req, res) {
  res.render('reglement', { title: 'Réglement - KovoitGo', pageCss: 'reglement' });
});

app.post('/reserve-trip', isAuthenticatedJWT, async (req, res) => {
  const { tripId } = req.body;

  res.status(200).send(); 
});

app.get('/payment', isAuthenticatedJWT, async (req, res) => {
  const { tripId } = req.query; 
  res.render('payment', { tripId });
});


app.get('/logout', function(req, res) {
  res.clearCookie('token');
  res.redirect('/');
});


app.post('/add-car', isAuthenticatedJWT, async (req, res) => {
  try {
      const { model, seats, plate, horsepower, engine, image } = req.body;

      // Vérifier que l'image est bien une URL
      if (!image.startsWith('http')) {
          return res.status(400).json({ error: "L'URL de l'image est invalide." });
      }

      const newCar = new Car({
        owner: req.user._id,  // ✅ Lier la voiture à l'utilisateur
          model,
          seats,
          plate,
          horsepower,
          engine,
          image
      });

      await newCar.save();
      res.json({ message: 'Voiture ajoutée avec succès', car: newCar });

  } catch (error) {
      console.error('Erreur lors de l\'ajout de la voiture:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});



app.post('/create-trip', isAuthenticatedJWT, async function(req, res) {
  console.log("🔥 Requête reçue sur /create-trip");
  console.log("🔥 Requête reçue sur /create-trip");
  console.log("[Prod DEBUG] Headers:", req.headers);
  console.log("[Prod DEBUG] Body brut:", req.body);
  const { carId, startPoint, endPoint, price, additionalInfo, departureTime } = req.body;

  try {
    if (!carId) {
      return res.status(400).json({ error: 'Veuillez choisir une voiture' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: 'Voiture introuvable' });
    }

    // Vérifier que la date de départ est valide
    const departureDate = new Date(departureTime);
    if (isNaN(departureDate.getTime()) || departureDate < new Date()) {
      return res.status(400).json({ error: "L'heure de départ est invalide ou déjà passée." });
    }

    // ✅ Récupérer les coordonnées GPS
    const startCoordinates = await getCoordinates(startPoint);
    const endCoordinates = await getCoordinates(endPoint);

    if (!startCoordinates || !endCoordinates) {
      return res.status(400).json({ error: "Impossible de récupérer les coordonnées du trajet." });
    }

    // ✅ Appel Google Maps Directions API pour durée et distance
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`, {
        params: {
          origin: startPoint,
          destination: endPoint,
          mode: 'driving',
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    );
    
    console.log("📦 Directions API Response:", response.data); // ← ajoute ça
    

console.log("📦 Directions API Response:", response.data); // ← ajoute ça


    const route = response.data.routes?.[0];
    const leg = route?.legs?.[0];

    if (!leg) {
      return res.status(404).json({ error: "Itinéraire introuvable avec Google Maps." });
    }

    const duration = leg.duration.text;
    const distance = leg.distance.text;
    const durationSeconds = leg.duration.value;
    const arrivalDate = new Date(departureDate.getTime() + durationSeconds * 1000);

    const trip = new Trip({
      driver: req.user._id,
      car: car._id,
      startPoint,
      endPoint,
      startCoordinates,
      endCoordinates,
      departureTime: departureDate,
      arrivalTime: arrivalDate,
      seatsAvailable: car.seats,
      price,
      additionalInfo,
      duration,
      distance
    });

    await trip.save();
    res.json({ message: 'Trajet créé avec succès !', trip });

  } catch (error) {
    console.error('Erreur lors de la création du trajet :', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
  
});


app.post('/trips/:id/delete', isAuthenticatedJWT, async (req, res) => {
  try {
      const result = await Trip.findByIdAndDelete(req.params.id);
      if (!result) {
          return res.status(404).send("Trajer introuvable");
      }
      res.redirect('/driverHome'); 
  } catch (error) {
      console.error('Error deleting trip:', error);
      res.status(500).send("Internal server error");
  }
});


app.get('/driverHome', isAuthenticatedJWT, async function(req, res) {
  if (req.user.role === 'driver') {
      try {
          const cars = await Car.find({ owner: req.user._id }); // ✅ Seules ses voitures
          const trips = await Trip.find({ driver: req.user._id }).populate('car');

          res.render('driverHome', {
              title: 'Espace Conducteur',
              user: req.user,
              cars: cars,
              trips: trips,
              googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
              pageCss: 'driver'

          });
      } catch (error) {
          console.error('Erreur lors de la récupération des voitures:', error);
          res.status(500).send("Erreur interne du serveur.");
      }
  } else {
      res.redirect('/passengerHome');
  }
});


app.get('/passengerHome', isAuthenticatedJWT, async function(req, res) {
  if(req.user.role === 'passenger') {
    try {
      const trips = await Trip.find().populate('car').populate('driver');
      res.render('passengerHome', {
        title: 'Espace Passager',
        user: req.user,
        trips: trips,
        pageCss: 'passenger',
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des trajets:', error);
      res.status(500).send("Erreur interne du serveur.");
    }
  } else {
    res.redirect('/driverHome');
  }
});

app.post('/search-trips', isAuthenticatedJWT, async (req, res) => {
  const { start, end, date } = req.body;

  try {
    const startCoords = await getCoordinates(start);
    const endCoords = await getCoordinates(end);

    if (!startCoords || !endCoords) {
      return res.status(400).send("Ville non reconnue.");
    }

    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    let allTrips = await Trip.find({
      departureTime: { $gte: dayStart, $lte: dayEnd }
    }).populate('car').populate('driver');

    // Filtrage par rayon de 30km
    allTrips = allTrips.filter(trip => {
      const tripStart = trip.startCoordinates;
      const tripEnd = trip.endCoordinates;
    
      if (!tripStart || !tripEnd) return false; // ⛔ ignorer les trajets sans coordonnées
    
      return isWithinRadius(startCoords, tripStart) && isWithinRadius(endCoords, tripEnd);
    });

    res.render('searchResults', {
      title: 'Résultats de recherche',
      user: req.user,
      trips: allTrips
    });

  } catch (error) {
    console.error("Erreur recherche trajets:", error);
    res.status(500).send("Erreur interne");
  }
});


app.post("/users/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log(`[SIGNUP] Demande pour ${username} (${email}) en tant que ${role}`);

    // ✅ Validation du format email
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Format d'email invalide." });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error: "Mot de passe faible. Il doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre."
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Le nom d'utilisateur ou l'email est déjà pris." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await new User({ username, email, hashedPassword, role }).save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    const redirectPath = role === 'driver' ? '/driverHome' : '/passengerHome';
    res.json({ message: "Inscription réussie", redirect: redirectPath });

  } catch (error) {
    console.error("Erreur d'inscription:", error);
    res.status(500).json({ error: "Erreur lors de l'inscription. Veuillez réessayer." });
  }
});


app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(401).send("Email ou mot de passe incorrect.");

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) return res.status(401).send("Email ou mot de passe incorrect.");

    // ✅ Création du JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // 24h
    );

    // ✅ Cookie sécurisé
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 jour
    });

    res.redirect(user.role === "driver" ? "/driverHome" : "/passengerHome");

  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).send("Erreur interne du serveur.");
  }
});




// app.js
app.post('/process-payment', isAuthenticatedJWT, async (req, res) => {
  // ... your payment processing logic ...

  if (paymentSuccessful) {
    res.json({ success: true, message: 'Paiement confirmé.' });
  } else {
    res.json({ success: false, message: 'Paiement échoué.' });
  }
});


app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
