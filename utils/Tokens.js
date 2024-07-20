import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { getToken, saveToken } from '../models/tokens.model.js';

dotenv.config();

function sign(payload, isAccessToken) {
    return jwt.sign(
        payload,
        isAccessToken
            ? process.env.ACCESS_TOKEN_SECRET
            : process.env.REFRESH_TOKEN_SECRET,
        {
            algorithm: "HS256",
            expiresIn: 3600,
        }
    );
}
// Función para generar el token de acceso
export function generateAccessToken(infoUser) {
    return sign({ infoUser }, true);
}

// Función para generar el token de actualización
export async function generateRefreshToken(infoUser) {
    const refreshToken = sign({ infoUser }, false);
    try {
        const existsToken = await getToken(refreshToken);

        if (!existsToken) {
            await saveToken(refreshToken);
        } else {
            console.log("Token ya registrado");
        }

        return refreshToken;
    } catch (error) {
        console.log(error);
    }

}

// Tratamiento de cadena HEADERS

export function getTokenHeader(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');

        if (parted.length === 2) {
            return parted[1];
        }
        return null;
    }
    return null;
}

// VERIFICAR TOKENS

export function verifyAccessToken(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}


export function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}
