const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const favicon = require('serve-favicon');
const User = require('./models/User');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/EcoCovoit')
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

app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.get('/driverHome', isAuthenticated, function(req, res) {
  res.render('driverHome', {
    title: 'Espace Conducteur',
    user: req.user
  });
});

app.get('/passengerHome', isAuthenticated, function(req, res) {
  res.render('passengerHome', {
    title: 'Espace Passager',
    user: req.user
  });
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
      hashedPassword, // Utilisation de hashedPassword au lieu de password
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
    console.log("Mot de passe stocké (haché):", user.hashedPassword); // Utilisation de hashedPassword au lieu de password
 
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

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
