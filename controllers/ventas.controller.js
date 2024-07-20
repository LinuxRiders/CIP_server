import getPaquetesRequest, { getProductosRequest } from "../models/ventas.model.js";

export default async function getProducts(req,res) {
    const data = await getProductosRequest();

    res.status(200).json
    ({
        statusCode: 200,
        data 

    }); 
    
}

export async function getPaquetes(req,res) {
    const data = await getPaquetesRequest();

    res.status(200).json
    ({
        statusCode: 200,
        data 

    }); 

}