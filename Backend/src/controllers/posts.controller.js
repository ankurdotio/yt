import Post from '../models/post.model.js';
import Like from '../models/like.model.js';
import User from '../models/user.model.js';

import path from "path";
import fs from "fs";
import { uploadFile } from "../utils/pixxo.js";

// Image upload handler
export const uploadImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		// Save file to temp folder
		const tempDir = path.join(process.cwd(), "temp");
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir);
		}
		const tempPath = path.join(tempDir, req.file.originalname);
		await fs.promises.writeFile(tempPath, req.file.buffer);

		// Upload to Pixxo
		const result = await uploadFile(req.file.originalname);

		return res.json({
      success: true,
      url: result.url,
      message: "Image uploaded successfully" 
    });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

/**
 * Create a new post
 * POST /api/posts
 */
export const createPost = async (req, res) => {
  try {
    const { media, caption } = req.body;
    const userId = req.user?.id;

    // Create post
    const post = new Post({
      user: userId,
      media,
      caption: caption || '',
      likecount: 0,
      commentcount: 0,
    });

    await post.save();

    // Populate user data
    await post.populate('user', 'username avatar');

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message,
    });
  }
};

/**
 * Get feed (global timeline) with pagination
 * GET /api/posts?page=1&limit=10
 */
export const getFeed = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // Fetch posts
    const posts = await Post.find()
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Post.countDocuments();

    return res.status(200).json({
      success: true,
      message: 'Feed fetched successfully',
      data: {
        posts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get feed error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching feed',
      error: error.message,
    });
  }
};

/**
 * Get posts by a specific user
 * GET /api/posts/user/:userId?page=1&limit=10
 */
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Fetch user's posts
    const posts = await Post.find({ user: userId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Post.countDocuments({ user: userId });

    return res.status(200).json({
      success: true,
      message: 'User posts fetched successfully',
      data: {
        posts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user posts',
      error: error.message,
    });
  }
};

/**
 * Get a single post by ID
 * GET /api/posts/:id
 */
export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch post
    const post = await Post.findById(id).populate('user', 'username avatar email bio');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post fetched successfully',
      data: post,
    });
  } catch (error) {
    console.error('Get single post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message,
    });
  }
};

/**
 * Delete a post (only owner can delete)
 * DELETE /api/posts/:id
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Find post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check authorization (only owner can delete)
    if (post.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own posts',
      });
    }

    // Delete post
    await Post.findByIdAndDelete(id);

    // Delete all likes associated with this post
    await Like.deleteMany({ postid: id });

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message,
    });
  }
};

/**
 * Toggle like/unlike on a post
 * POST /api/posts/:id/like
 */
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if like already exists
    const existingLike = await Like.findOne({
      userid: userId,
      postid: id,
    });

    if (existingLike) {
      // Unlike: delete like and decrement count
      await Like.deleteOne({ _id: existingLike._id });

      // Decrement likecount (prevent negative)
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likecount: Math.max(0, post.likecount - 1) },
        { new: true }
      ).populate('user', 'username avatar');

      return res.status(200).json({
        success: true,
        message: 'Post unliked successfully',
        data: {
          post: updatedPost,
          liked: false,
        },
      });
    } else {
      // Like: create like and increment count
      const newLike = new Like({
        userid: userId,
        postid: id,
      });

      await newLike.save();

      // Increment likecount
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likecount: post.likecount + 1 },
        { new: true }
      ).populate('user', 'username avatar');

      return res.status(200).json({
        success: true,
        message: 'Post liked successfully',
        data: {
          post: updatedPost,
          liked: true,
        },
      });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message,
    });
  }
};
