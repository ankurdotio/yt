import { Router } from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import postsRouter from "./posts.routes.js";
import commentRouter from "./comment.routes.js";

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentRouter);

export default router;
