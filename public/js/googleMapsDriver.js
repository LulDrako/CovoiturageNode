function initGoogleMapsStuff() {
  console.log("📍 initAutocomplete appelée");
  console.log("🗺️ initGoogleMapsStuff appelée");

    initMap();         // Affiche la carte
    initAutocomplete(); // Active la suggestion Google
  }
  
  function initAutocomplete() {
    const options = {
      componentRestrictions: { country: "fr" },
      fields: ["place_id", "geometry", "name"]
    };
  
    const startInput = document.getElementById("start-point");
    const endInput = document.getElementById("end-point");
  
    if (startInput) new google.maps.places.Autocomplete(startInput, options);
    if (endInput) new google.maps.places.Autocomplete(endInput, options);
  }

  window.initGoogleMapsStuff = initGoogleMapsStuff;

  