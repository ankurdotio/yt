import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/posts.controller.js';


const postsRouter = Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
/**
 * TODO: Implement the following routes for posts:
 * - POST /api/posts: Create a new post
 * - GET /api/posts: Get all posts
 */

// Image upload route
postsRouter.post('/upload-image', upload.single('image'), uploadImage);

export default postsRouter;
