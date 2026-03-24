import express, {Router} from 'express';
import { addToCart, updateCart, getUserCart, removeItemFromCart, emptyCart } from '../controllers/cart';

const router: Router = express.Router();

router.get('/', getUserCart);
router.post('/:productId', addToCart);
router.put('/', updateCart);
router.delete('/', emptyCart);

export default router;