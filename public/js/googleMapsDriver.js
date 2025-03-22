function initGoogleMapsStuff() {
  initMap();
  console.log("✅ Google Maps initialisé.");

  const options = {
      componentRestrictions: { country: "fr" },
      fields: ["place_id", "geometry", "name"]
  };

  const startInput = document.getElementById("start-point");
  const endInput = document.getElementById("end-point");

  if (startInput) {
      const autocompleteStart = new google.maps.places.Autocomplete(startInput, options);
      autocompleteStart.addListener("place_changed", () => {
          const place = autocompleteStart.getPlace();
          startInput.dataset.placeId = place.place_id || "";
      });
  }

  if (endInput) {
      const autocompleteEnd = new google.maps.places.Autocomplete(endInput, options);
      autocompleteEnd.addListener("place_changed", () => {
          const place = autocompleteEnd.getPlace();
          endInput.dataset.placeId = place.place_id || "";
      });
  }
}
