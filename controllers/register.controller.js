import { registerUser, getUserById } from "../models/user.model.js";
import { registerUserVoucher } from "../models/userVoucher.model.js";
import logger from "../utils/logger.js"


// Controlador para manejar la creación de usuarios
export async function createUser(req, res) {
    // Extraer los datos del cuerpo de la solicitud (request body)
    const { usuario, email, password, role, tipo_inscripcion, nombres, apellidos, telefono, dni, ciudad, centro_estudios, codqr } = req.body;

    try {
        // Llamar a la función para registrar usuario y datos adicionales
        const result = await registerUser({ usuario, email, password, role, tipo_inscripcion, nombres, apellidos, telefono, dni, ciudad, centro_estudios, codqr });

        // Registrar actividad exitosa
        logger.info(`User created: ${usuario}, Email: ${email}`);

        // Enviar respuesta de éxito al cliente
        res.status(201).json({ statusCode: 201, message: result });

    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        // Registrar actividad de error
        logger.error(`Error creating user: ${error.message}`);

        // Enviar respuesta de error al cliente
        res.status(500).json({ statusCode: 500, error: 'Error al crear usuario.' });
    }
}




// Controlador para manejar la creación de usuarios POR BOUCHER PAGO
export async function createUserTemp(req, res) {
    // Extraer los datos del cuerpo de la solicitud (request body)
    const { usuario, email, password, role, tipo_inscripcion, nombres, apellidos, telefono, dni, ciudad, centro_estudios, codqr, file, fileType } = req.body;

    try {
        // Llamar a la función para registrar usuario y datos adicionales
        const result = await registerUserVoucher({ usuario, email, password, role, tipo_inscripcion, nombres, apellidos, telefono, dni, ciudad, centro_estudios, codqr, file, fileType });

        // Registrar actividad exitosa
        logger.info(`Usuario Por Verificar: ${usuario}, Email: ${email}`);

        // Enviar respuesta de éxito al cliente
        res.status(201).json({ statusCode: 201, message: result });

    } catch (error) {
        console.error('Error al Enviar Voucher:', error.message);
        // Registrar actividad de error
        logger.error(`Error al Enviar Voucher: ${error.message}`);

        // Enviar respuesta de error al cliente
        res.status(500).json({ statusCode: 500, error: 'Error al Enviar Voucher.' });
    }

}