import { body, validationResult } from 'express-validator';
import { isValidEmail, isValidPassword, isValidDNI } from '../utils/validationFunctions.js';

// Middleware para validar los datos de entrada usando express-validator
export const validateInputs = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    // Si hay errores de validación, devolver una respuesta con los errores
    return res.status(422).json({
        statusCode: 422,
        error: errors.array()
    });
};

// Reglas de validación para la creación de usuarios
export const userValidationRules = () => {
    return [
        body('usuario').isString().notEmpty(),
        body('email').isEmail(),
        body('password')
            .notEmpty().withMessage('El campo contraseña es requerido')
            .isString().withMessage('La contraseña debe ser una cadena de texto')
            .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
            .matches(/\d/).withMessage('La contraseña debe incluir al menos un número')
            .matches(/[a-z]/).withMessage('La contraseña debe incluir al menos una letra minúscula')
            .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una letra mayúscula')
            .matches(/[!@#$%^&*()_+={}\[\]:;"'<>,.?/~\\|\-]/).withMessage('La contraseña debe incluir al menos un carácter especial'),
        body('role').default('usuario').isIn(['usuario', 'administrador']),
        body('tipo_inscripcion').isIn(['general', 'colegiado', 'estudiante']),
        body('nombres').isString().notEmpty(),
        body('apellidos').isString().notEmpty(),
        body('telefono').optional().isString().isLength({ min: 11, max: 12 }),
        body('dni').notEmpty().withMessage('El campo DNI es requerido')
            .isString().withMessage('El DNI debe ser una cadena de texto')
            .matches(/^\d+$/).withMessage('El DNI debe contener solo números')
            .isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener exactamente 8 caracteres'),
        body('ciudad').isString().notEmpty(),
        body('centro_estudios').optional().isString(),
        body('codqr').isEmpty().withMessage('El campo codqr no debe contener ningún valor')
    ];
};
