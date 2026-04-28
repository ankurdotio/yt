import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/posts.controller.js';

const postsRouter = Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Image upload route
postsRouter.post('/upload-image', upload.single('image'), uploadImage);

export default postsRouter;
