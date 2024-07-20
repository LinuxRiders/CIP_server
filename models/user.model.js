import { pool } from '../utils/db.js';
import bcrypt from 'bcrypt';

import { createHash } from 'crypto';
import QRCode from 'qrcode';


// Función para generar y obtener el código QR como URL de datos
const generateQRCodeDataURL = async (text, options = {}) => {
    try {
        // Opciones de configuración del código QR (ejemplo)
        const defaultOptions = {
            errorCorrectionLevel: 'H', // Nivel de corrección de errores (L, M, Q, H)
            type: 'image/png', // Formato de imagen (image/png, image/jpeg)
            quality: 0.92, // Calidad de imagen (solo para JPEG)
            margin: 1, // Margen alrededor del código QR
            scale: 8, // Escala del código QR
            color: {
                dark: '#13111C', // Color de los módulos oscuros del código QR
                light: '#49348F' // Color de los módulos claros del código QR
            }
        };

        // Combinar opciones personalizadas con las predeterminadas
        const qrCodeOptions = { ...defaultOptions, ...options };

        // Generar el código QR como URL de datos
        const qrCodeDataURL = await QRCode.toDataURL(text, qrCodeOptions);

        return qrCodeDataURL;
    } catch (error) {
        throw new Error(`Error al generar el código QR: ${error.message}`);
    }
};

// Función para generar un código QR único basado en el ID del usuario
const generateQRCode = (id) => {
    // Crear un hash MD5 del ID para obtener un valor único
    const hash = createHash('md5').update(String(id)).digest('hex');

    // Tomar los primeros 5 caracteres del hash para el código QR
    const qrCode = hash.substr(0, 5).toUpperCase(); // Tomamos los primeros 5 caracteres y los convertimos a mayúsculas

    return qrCode;
};

// Función para registrar información de usuario y datos adicionales
export const registerUser = async ({
    usuario,
    email,
    password,
    role = 'usuario',
    tipo_inscripcion,
    nombres,
    apellidos,
    telefono,
    dni,
    ciudad,
    centro_estudios,
    codqr
}) => {
    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Iniciar una transacción
        await pool.query('START TRANSACTION');

        // Insertar el usuario en la tabla users
        const userInsertResult = await pool.query(
            'INSERT INTO users (usuario, email, password, role) VALUES (?, ?, ?, ?)',
            [usuario, email, hashedPassword, role]
        );

        // Obtener el ID del usuario insertado
        const userId = userInsertResult[0].insertId;

        // Obtener codqr basado en el ID del usuario insertado
        const codeQR = generateQRCode(userId);
        console.log(codeQR);

        console.log(await generateQRCodeDataURL(codeQR.toString()));

        // Insertar los datos adicionales en la tabla userData
        await pool.query(
            'INSERT INTO userData (tipo_inscripcion, nombres, apellidos, telefono, dni, ciudad, centro_estudios, codqr, idUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                tipo_inscripcion,
                nombres,
                apellidos,
                telefono,
                dni,
                ciudad,
                centro_estudios,
                codeQR,
                userId
            ]
        );

        // Confirmar la transacción
        await pool.query('COMMIT');

        // Devolver una respuesta de éxito
        return { success: true, message: 'User and userData registered successfully.' };
    } catch (error) {
        // Revertir la transacción en caso de error
        await pool.query('ROLLBACK');
        throw new Error(`Failed to register user and userData. ${error.message}`);
    }
};

// ================================ LOGIN ===========================

// Función para buscar un usuario por correo electrónico
export const getUserById = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

// Función para comparar la contraseña proporcionada con la almacenada en la base de datos
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};