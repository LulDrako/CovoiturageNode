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

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

module.exports = {
    validatePlate,
    formatPlate,
    validateEmail,
    validatePassword
};
