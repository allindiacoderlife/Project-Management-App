import express from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketOrder,
  deleteTicket,
} from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getTickets).post(createTicket);
router.route('/:id').get(getTicketById).put(updateTicket).delete(deleteTicket);
router.patch('/:id/order', updateTicketOrder);

export default router;
