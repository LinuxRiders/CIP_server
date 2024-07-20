import express from "express";
import cors from 'cors';

import ventas from './routes/ventas.routes.js'
import login from './routes/login.routes.js'
import register from './routes/register.routes.js'
import { sendMail } from "./utils/mailer.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// app.use('/api/ventas', ventas);

app.use('/api/login', login);
app.use('/api/register', register);

app.get('/ping', (req, res) => {
    res.send("Conexion Funcional");
})


app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
