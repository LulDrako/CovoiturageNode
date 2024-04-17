// In routes/index.js
router.get('/', function(req, res, next) {
  if (req.user.role === 'driver') {
    res.render('driverHome', { title: 'Driver Home' }); // EJS file for driver
  } else {
    res.render('passengerHome', { title: 'Passenger Home' }); // EJS file for passenger
  }
});
