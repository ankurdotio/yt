import { Router } from 'express';

const postsRouter = Router();

/**
 * TODO: Implement the following routes for posts:
 * - POST /api/posts: Create a new post
 * - GET /api/posts: Get all posts
 *
 */

/**
 * support images type:
 * PNG - image/png
 * JPEG - image/jpeg
 * WEBP - image/webp
 * HEIC - image/heic
 * HEIF - image/heif
 */
postsRouter.route('/');

export default postsRouter;
