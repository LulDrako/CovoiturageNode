function initGoogleMapsPassenger() {
    console.log("🌍 Google Maps Passenger init");
  
    const options = {
      types: ["(cities)"],
      componentRestrictions: { country: "fr" },
      fields: ["place_id", "geometry", "name"]
    };
  
    const startInput = document.getElementById("start");
    const endInput = document.getElementById("end");
  
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
  