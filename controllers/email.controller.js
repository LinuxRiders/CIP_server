import logger from "../utils/logger.js";
import { generateHash, sendMail } from "../utils/mailer.js";

// Controllador para enviar correo de verificacion con nodemailer y google OAuth2
export const sendEmailCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        // Si hay errores de validación, devolver una respuesta con los errores
        res.status(422).json({
            statusCode: 400,
            error: "Email is required"
        });
    }

    try {

        // Generar un Codigo de Verificacion valido por 5min
        const code = generateHash(email);

        // Registrar actividad exitosa
        logger.info(`Codigo generado exitosamente ${code}`);

        // Enviar Mail con el codigo de verificación
        const result = await sendMail(email, './templates/code.template.html', 'Codigo de Verificación', { code0: code[0], code1: code[1], code2: code[2], code3: code[3], code4: code[4], code5: code[5] });

        // Registrar actividad exitosa
        logger.info(`Correo enviado exitosamente: ${result.response}`);

        // Enviar respuesta de éxito al cliente
        res.status(201).json({ statusCode: 201, message: `Correo enviado exitosamente: ${result.response}` });

    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
        // Registrar actividad de error
        logger.error(`Error al enviar el correo: ${error.message}`);

        // Enviar respuesta de error al cliente
        res.status(500).json({ statusCode: 500, error: 'Error al enviar el correo' });
    }
};

// Controllador para verificacion de codigo enviado al correo
export const verifyEmailCode = async (req, res) => {
    return res.status(201).json({
        statusCode: 201,
        message: "Codigo Exitoso",
        validCode: true
    });
};

