
var swiper = new Swiper('.swiper-container', {
    slidesPerView: "auto",  // Permet aux slides de s'adapter à la taille de l'écran
    centeredSlides: true,   // Centre les slides pour un effet plus esthétique
    spaceBetween: 15,       // Espacement entre les slides
    loop: false,            // Désactive le loop pour éviter les bugs de fin
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});


    var map, directionsService, directionsRenderer;

    function initMap() {
        var mapElement = document.getElementById('google-map');
        if (mapElement) {
            map = new google.maps.Map(mapElement, {
                zoom: 6,
                center: { lat: 46.2276, lng: 2.2137 }
            });

            directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
            directionsService = new google.maps.DirectionsService();
            console.log("Google Maps initialisé.");
        } else {
            console.error("Erreur : élément #google-map introuvable.");
        }
    }

    function selectCar(carId, carModel, seats) {
        document.getElementById('selected-car-id').value = carId;
        document.getElementById('confirmation').innerText = carModel + ' sélectionnée avec ' + seats + ' sièges disponibles.';
    }

    function calculateRoute() {
        var start = document.getElementById('start-point').value;
        var end = document.getElementById('end-point').value;
        var departureTime = document.getElementById('departure-time').value;
    
        if (!start || !end || !departureTime) {
            alert("Veuillez entrer un point de départ, un point d'arrivée et une heure de départ.");
            return;
        }
    
        directionsService.route(
            {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            },
            function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(response);
                    var route = response.routes[0].legs[0];
    
                    document.getElementById("start-address").textContent = route.start_address;
                    document.getElementById("end-address").textContent = route.end_address;
                    document.getElementById("distance").textContent = route.distance.text;
                    document.getElementById("duration").textContent = route.duration.text;
    
                    // ✅ Calcul de l'heure d'arrivée
                    var departureDate = new Date(departureTime);
                    var travelDurationSeconds = route.duration.value; // Durée en secondes
                    var arrivalDate = new Date(departureDate.getTime() + travelDurationSeconds * 1000);
    
                    // ✅ Formatage et affichage de l'heure d'arrivée estimée
                    document.getElementById("arrival-time").textContent = arrivalDate.toLocaleString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
    
                    console.log("✅ Itinéraire calculé avec succès.");
                } else {
                    console.error("❌ Erreur Directions API :", status);
                    alert("Impossible de calculer l'itinéraire. Vérifiez vos entrées.");
                }
            }
        );
    }
    

    function submitTrip(event) {
        event.preventDefault();
    
        const formData = new FormData(document.getElementById('trip-form'));
    
        const requestData = {
            carId: formData.get('carId'),
            startPoint: formData.get('start'),
            endPoint: formData.get('end'),
            price: formData.get('price'),
            departureTime: formData.get('departureTime'),
            additionalInfo: formData.get('additionalInfo')
        };
    
        console.log("📤 Envoi des données de trajet:", requestData);
    
        fetch('/create-trip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('✅ Réponse du serveur:', data);
            if (data.error) {
                alert("❌ Erreur: " + data.error);
            } else {
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('❌ Erreur lors de la création du trajet:', error);
            alert('Erreur serveur.');
        });
    }
    

    function submitCar(event) {
        event.preventDefault();
        var formData = new FormData(document.getElementById('add-car-form'));

        fetch('/add-car', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: formData.get('model'),
                seats: formData.get('seats'),
                plate: formData.get('plate'),
                horsepower: formData.get('horsepower'),
                engine: formData.get('engine'),
                image: formData.get('image')
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Voiture ajoutée:', data);
            window.location.reload();
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout de la voiture:', error);
        });
    }

    function deleteTrip(tripId) {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
            fetch(`/trips/${tripId}/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Échec de la suppression du trajet.');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la suppression du trajet:', error);
            });
        }
    }
    
    document.addEventListener("DOMContentLoaded", function () {
        let departureInput = document.getElementById("departure-time");
    
        function updateMinDateTime() {
            let now = new Date();
            let localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16); // Formate en "YYYY-MM-DDTHH:MM"
    
            departureInput.min = localISOTime;
        }
    
        // Mettre à jour la restriction immédiatement et à chaque fois que la page est chargée
        updateMinDateTime();
    });

    document.addEventListener("DOMContentLoaded", function() {
        initMap();
    
        // 📌 Formattage automatique de la plaque d'immatriculation
        document.getElementById("plate").addEventListener("input", function(event) {
            let value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Supprime caractères interdits + majuscules
            let formattedValue = "";
    
            // 📌 Construction progressive de la plaque
            if (value.length > 0) formattedValue += value.slice(0, 2);
            if (value.length > 2) formattedValue += '-' + value.slice(2, 5);
            if (value.length > 5) formattedValue += '-' + value.slice(5, 7);
    
            // 📌 Mise à jour de l'input avec la valeur formatée
            this.value = formattedValue;
    
            // 📌 Bloque l'écriture quand le format est atteint
            if (formattedValue.length >= 9 && event.inputType !== "deleteContentBackward") {
                event.preventDefault();
                return false;
            }
        });
    
        // 📌 Validation et soumission du formulaire
        document.getElementById("add-car-form").addEventListener("submit", function(event) {
            let plate = document.getElementById("plate").value;
            let seats = parseInt(document.getElementById("seats").value);
            let horsepower = parseInt(document.getElementById("horsepower").value);
            let image = document.getElementById("car-image-url").value;
    
            // Vérification du format de la plaque d'immatriculation
            let plateRegex = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/;
            if (!plateRegex.test(plate)) {
                alert("Format de plaque invalide. Exemple : AA-123-AA");
                event.preventDefault();
                return;
            }
    
            // Vérification des limites des sièges et chevaux
            if (seats < 1 || seats > 9) {
                alert("Le nombre de sièges doit être compris entre 1 et 9.");
                event.preventDefault();
                return;
            }
    
            if (horsepower < 1 || horsepower > 999) {
                alert("Les chevaux doivent être compris entre 1 et 999.");
                event.preventDefault();
                return;
            }
    
            // Vérification de l'image (URL obligatoire)
            if (!image) {
                alert("Veuillez entrer une URL valide pour l'image.");
                event.preventDefault();
                return;
            }
        
            // ✅ Si tout est bon, on envoie les données
            submitCar(event);
        });
    });
    