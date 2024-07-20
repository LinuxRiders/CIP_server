import { body, header, validationResult } from "express-validator";
import { verifyHash } from "../utils/mailer.js";

// Reglas de validación para el envio de correos
const codeEmailValidationRules = [
    body('email').isEmail().withMessage('El campo email debe ser un correo válido'),
    header('codeEmail').notEmpty().withMessage('El campo codeEmail es requerido')
        .isString().withMessage('codeEmail debe ser una cadena de texto')
        .matches(/^\d+$/).withMessage('codeEmail debe contener solo números')
        .isLength({ min: 6, max: 6 }).withMessage('codeEmail debe tener exactamente 6 caracteres'),
];


// Middleware para validar correo electronico por codigo generado
export const validateEmail = async (req, res, next) => {
    // Ejecutar reglas de validación
    for (let rule of codeEmailValidationRules) {
        await rule.run(req);
    }

    // Manejo de errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            statusCode: 422,
            error: errors.array(),
        });
    }

    const codeEmail = req.header('codeEmail');
    const { email } = req.body;

    if (verifyHash(email, codeEmail)) {
        /*return res.status(201).json({
            statusCode: 201,
            message: "Codigo Exitoso"
        });*/
        return next();
    }

    // Si hay errores de validación, devolver una respuesta con los errores
    return res.status(422).json({
        statusCode: 422,
        error: "Codigo Incorrecto",
        validCode: false
    });
};

