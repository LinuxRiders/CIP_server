import {Router} from 'express';
import getProducts,{getPaquetes} from '../controllers/ventas.controller.js';


const router = Router();


router.get('/productos', getProducts);
router.get('/paquetes', getPaquetes);

export default router;