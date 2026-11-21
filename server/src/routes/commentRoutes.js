import express from 'express';
import {
  getCommentsByTicket,
  createComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/:ticketId/comments').get(getCommentsByTicket).post(createComment);
router.route('/comments/:id').delete(deleteComment);

export default router;
