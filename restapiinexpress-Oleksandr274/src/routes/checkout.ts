import express, {Router} from 'express';
import { createCheckoutSession } from '../controllers/checkout';


const router: Router = express.Router();

router.post('/', createCheckoutSession);

export default router;