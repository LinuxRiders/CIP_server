import { Router } from 'express';
import { createUser, createUserTemp } from '../controllers/register.controller.js';
import { userValidationRules, validateInputs } from '../middlewares/validationMiddleware.js';
import { sendEmailCode, verifyEmailCode } from '../controllers/email.controller.js';
import { emailValidationRules } from '../utils/mailer.js';
import { validateEmail } from '../middlewares/emailverify.middleware.js';

const router = Router();

router.post('/sendmail', emailValidationRules(), validateInputs, sendEmailCode);
router.post('/verifyemail', validateEmail, verifyEmailCode);
router.post('/userVoucher', userValidationRules(), validateInputs, createUserTemp);
// router.post('/user', validateEmail, userValidationRules(), validateInputs, createUser);

export default router;