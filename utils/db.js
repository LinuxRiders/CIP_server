import {createPool}  from 'mysql2/promise';

import { config } from 'dotenv';
config();

export const pool = new createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Middleware para manejar errores de conexión
pool.on("error", (err) => {
    console.error("Error en el pool de conexiones MySQL", err);
});

// Evento para manejar conexiones exitosas
pool.on("acquire", (connection) => {
    console.log(`Conexión ${connection.threadId} adquirida del pool`);
});