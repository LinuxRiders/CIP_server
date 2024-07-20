import { pool } from "../utils/db.js";

export default async function getPaquetesRequest(){
    try {
        const [rows] = await pool.query("SELECT * FROM paquete");
        return rows;
    } catch (error) {
        console.log(error);
    }
}


export async function getProductosRequest(){
    try {
        const [rows] = await pool.query("SELECT * FROM producto");
        return rows;
    } catch (error) {
        console.log(error);
    }
    
}