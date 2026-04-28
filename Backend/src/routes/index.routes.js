import { Router } from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import postsRouter from "./posts.routes.js";


const router = Router();

router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is healthy'
    });
});

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/posts', postsRouter);


export default router;