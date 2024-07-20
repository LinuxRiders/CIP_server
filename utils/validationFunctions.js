// Función para validar un email
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar una contraseña fuerte
export function isValidPassword(password) {
    // Implementación básica de validación de contraseña fuerte
    return password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
}

// Función para validar un DNI (ejemplo básico para DNI peruano de 8 dígitos)
export function isValidDNI(dni) {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
}
