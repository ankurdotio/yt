import { Router } from 'express';
import multer from 'multer';
import express from 'express';
import {
  createPost,
  getFeed,
  getUserPosts,
  getSinglePost,
  deletePost,
  toggleLike,
  uploadImage,
} from '../controllers/posts.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { createPostValidator, validateRequest } from '../validation/post.validator.js';

const router = express.Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
/**
 * Public Routes
 */
// Get feed (global timeline)
router.get('/', getFeed);

// Get user posts
router.get('/user/:userId', getUserPosts);

// Get single post
router.get('/:id', getSinglePost);

// Image upload route
router.post('/upload-image', upload.single('image'), uploadImage);
/**
 * Protected Routes (require authentication)
 */
// Create post
router.post('/', protect, createPostValidator, validateRequest, createPost);

// Delete post
router.delete('/:id', protect, deletePost);

// Toggle like/unlike
router.post('/:id/like', protect, toggleLike);

export default router;
