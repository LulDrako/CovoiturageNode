// ✅ Valide une plaque au format AA-123-AA
function validatePlate(plate) {
    return /^[A-Z]{2}-\d{3}-[A-Z]{2}$/.test(plate);
}

function formatPlate(rawPlate) {
    let clean = rawPlate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length === 7) {
        return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5)}`;
    }
    return clean;
}

module.exports = {
    validatePlate,
    formatPlate
};
