import {Router} from 'express';
import login from './login.routes.js'
import register from './register.routes.js'

const router = Router();

router.use('/login', login);
router.use('/register', register);

router.get('/ping', (req, res) => {
    res.send("Conexion Funcional");
})

export default router;