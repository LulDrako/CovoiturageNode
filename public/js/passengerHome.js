// Empêcher la sélection d'une date antérieure côté passager
let searchDateInput = document.getElementById("departure-time");
if (searchDateInput) {
    let now = new Date();
    let localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10); // yyyy-mm-dd uniquement

    searchDateInput.setAttribute("min", localISOTime);
}
