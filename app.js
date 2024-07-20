import express from "express";
import cors from 'cors';

import routes from './routes/routes.js'

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// app.use('/api/ventas', ventas);

app.use('/api/', routes); // Usa el router en el prefijo /api


app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
