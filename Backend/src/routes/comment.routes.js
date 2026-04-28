import express from 'express';
import { addComment, getPostComments, deleteComment } from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { addCommentValidator, validateRequest } from '../validation/comment.validator.js';

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
router.post('/', protect, addCommentValidator, validateRequest, addComment);

// Delete comment
router.delete('/:id', protect, deleteComment);

export default router;
