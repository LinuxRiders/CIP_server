// Contiene la lógica de controladores para manejar las solicitudes HTTP.

import { getUserById, comparePassword } from '../models/user.model.js';

import { generateAccessToken, generateRefreshToken, getTokenHeader, verifyRefreshToken } from '../utils/Tokens.js';

import { getToken, deleteToken } from '../models/tokens.model.js';

export const accessUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(req.body);

        if (!email || !password) {
            return res.status(400).json(
                {
                    statusCode: 400,
                    error: 'Campos Requeridos'

                });
        }

        const user = await getUserById(email);

        if (!user) {
            return res.status(400).json(
                {
                    statusCode: 400,
                    error: 'Autenticacion fallida. Usuario no Encontrado'

                });
        }

        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json(
                {
                    statusCode: 400,
                    error: 'Autenticacion fallida. Contraseña Incorrecta'

                });
        }

        // Autenticar Usuario
        const accessToken = generateAccessToken({
            usuario: user.usuario,
            email: user.email,
            role: user.role,
        });
        
        const refreshToken = await generateRefreshToken({
            usuario: user.usuario,
            email: user.email,
            role: user.role,
        });


        res.status(200).json(
            {
                statusCode: 200,
                user,
                accessToken,
                refreshToken
            });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export const refreshToken = async (req, res) => {
    try {
        const refreshToken = getTokenHeader(req.headers);


        if (!refreshToken) {
            return res.status(401).json(
                {
                    statusCode: 401,
                    error: 'Sin Autorizacion'
                });
        }

        const found = await getToken(refreshToken);

        if (!found) {
            return res.status(401).json(
                {
                    statusCode: 401,
                    error: 'Sin Autorizacion'
                });
        }

        const payload = verifyRefreshToken(found.token);

        if (!payload) {
            return res.status(401).json(
                {
                    statusCode: 401,
                    error: 'Sin Autorizacion'
                });
        }

        const accessToken = generateAccessToken(payload.infoUser);

        res.status(200).json(
            {
                statusCode: 200,
                accessToken,
            });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export const refreshUser = async (req, res) => {
    try {
        res.status(200).json(
            {
                statusCode: 200,
                user: req.user // Sacar req.user que pasa el Authenticate.js (End Point Protejido)
            });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const signOut = async (req, res) => {
    try {

        const refreshToken = getTokenHeader(req.headers);

        if (!refreshToken) {
            return res.status(401).json(
                {
                    statusCode: 401,
                    error: 'Sin Autorizacion'
                });
        }

        // BORRAR TOKEN DE BASE DATOS (MODEL TOKEN)
        deleteToken(refreshToken);

        res.status(200).json(
            {
                statusCode: 200,
                message: "Token Borrado",
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            error: "Server Error",
        });
    }
}
