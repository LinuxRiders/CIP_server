import { body } from 'express-validator';

import 'dotenv/config';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

import fs from 'fs';
import path from 'path';

// Reglas de validación para el envio de correos
export const emailValidationRules = () => {
    return [
        body('email').isEmail(),
    ];
};

// ---------------------FUNCIO ENVIO DE CORREOS --------------------

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


// Función para reemplazar variables en la plantilla HTML
function replaceTemplateVariables(template, variables) {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g'); 
        result = result.replace(regex, value);
    }
    return result;
}

// Función para enviar correos
export async function sendMail(toEmail,templatePath, asunto, variables) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        // Leer la plantilla HTML
        let htmlContent = fs.readFileSync(path.resolve(templatePath), 'utf8');
        htmlContent = replaceTemplateVariables(htmlContent, variables);

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: asunto,
            html: htmlContent
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: %s', result.response);
        return result;

    } catch (error) {
        console.log('Error al enviar correo:', error);
        throw error;
    }
}


// ---- GENERATE CODE VERIFY EMAIL -----
import crypto from 'crypto';

const SECRET_KEY_EMAIL = process.env.SECRET_KEY_EMAIL || 'mysecret';

// Función para generar el código hash
export function generateHash(email) {
    const now = Math.floor(Date.now() / 1000 / 300); // Marca de tiempo en intervalos de 5 minutos

    // Crear un hash usando HMAC y SHA256
    const hash = crypto.createHmac('sha256', SECRET_KEY_EMAIL)
                       .update(email + now)
                       .digest('hex');

    // Tomar los primeros 6 dígitos del hash como un número
    const code = parseInt(hash.substring(0, 6), 16) % 1000000; // Asegura que sea un número de 6 dígitos

    return code.toString().padStart(6, '0'); // Asegura que tenga 6 dígitos, rellenando con ceros a la izquierda si es necesario
}

// Función para verificar el código
export function verifyHash(email, code) {
    const now = Math.floor(Date.now() / 1000 / 300); // Marca de tiempo en intervalos de 5 minutos

    // Generar los hashes para los intervalos de tiempo actual y anterior (margen de error)
    const hashNow = crypto.createHmac('sha256', SECRET_KEY_EMAIL)
                          .update(email + now)
                          .digest('hex')
                          .substring(0, 6);
    const hashPrevious = crypto.createHmac('sha256', SECRET_KEY_EMAIL)
                               .update(email + (now - 1))
                               .digest('hex')
                               .substring(0, 6);

    // Comparar el código proporcionado con los hashes generados
    const isValidNow = parseInt(hashNow, 16) % 1000000 === parseInt(code, 10);
    const isValidPrevious = parseInt(hashPrevious, 16) % 1000000 === parseInt(code, 10);

    return isValidNow || isValidPrevious;
}


