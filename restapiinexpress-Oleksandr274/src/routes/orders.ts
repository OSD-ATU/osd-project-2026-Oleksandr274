import express, {Router} from 'express';
import { 
  getOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
 } from '../controllers/orders';
import { isAdmin } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.get('/', isAdmin,  getOrders);

router.get('/user', getUserOrders);

router.get('/:id', getOrderById);

router.post('/', createOrder);

router.put('/:id', isAdmin, updateOrderStatus);

router.delete('/:id', isAdmin, deleteOrder);

export default router;
