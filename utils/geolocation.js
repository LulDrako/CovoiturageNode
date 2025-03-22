const axios = require('axios');
const { getDistance } = require('geolib');

async function getCoordinates(cityName) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: cityName,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    const location = response.data.results[0]?.geometry.location;
    return location ? { lat: location.lat, lng: location.lng } : null;
  } catch (error) {
    console.error("Erreur getCoordinates:", error);
    return null;
  }
}

function isWithinRadius(coord1, coord2, radiusMeters = 25000) {
  if (!coord1 || !coord2) return false;
  return getDistance(coord1, coord2) <= radiusMeters;
}

module.exports = {
  getCoordinates,
  isWithinRadius
};
