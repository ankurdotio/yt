import express from 'express';
import {
  addComment,
  getPostComments,
  deleteComment
} from '../controllers/comment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { addCommentValidator } from '../validation/comment.validator.js';
import { validateRequest } from '../utils/validate.js';

const router = express.Router();

/**
 * Public Routes
 */
// Get comments for a post
router.get('/:postid', getPostComments);

/**
 * Protected Routes (require authentication)
 */
// Add comment
router.post(
  '/',
  authMiddleware,
  addCommentValidator,
  validateRequest,
  addComment
);

// Delete comment
router.delete('/:id', authMiddleware, deleteComment);

export default router;
