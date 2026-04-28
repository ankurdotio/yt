import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { generateCommentReply } from '../services/ai.service.js';

/**
 * Add a comment to a post
 * POST /api/comments
 */
export const addComment = async (req, res) => {
  try {
    const { postid, text, parentComment } = req.body;
    const userId = req.user?.id;

    // Check if post exists
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Validate parentComment if provided
    if (parentComment) {
      const parentCommentDoc = await Comment.findById(parentComment);
      if (!parentCommentDoc) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found',
        });
      }
    }

    // Create comment
    const comment = new Comment({
      postid,
      userid: userId,
      text: text.trim(),
      parentComment: parentComment || null,
      isAI: false,
    });

    await comment.save();
    await comment.populate('userid', 'username avatar');

    // Increment commentcount on post
    await Post.findByIdAndUpdate(postid, { commentcount: post.commentcount + 1 });

    // Trigger AI reply asynchronously if comment mentions @cherry
    if (text.includes('@cherry')) {
      triggerAIReply(postid, comment._id, text).catch((error) => {
        console.error('AI reply generation error:', error);
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message,
    });
  }
};

/**
 * Get comments for a post (includes nested replies)
 * GET /api/comments/:postid
 */
export const getPostComments = async (req, res) => {
  try {
    const { postid } = req.params;

    // Check if post exists
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Fetch all comments for the post (including replies)
    const comments = await Comment.find({ postid })
      .populate('userid', 'username avatar')
      .sort({ createdAt: 1 })
      .lean();

    // Structure comments with nested replies
    const structuredComments = comments
      .filter((comment) => !comment.parentComment)
      .map((comment) => ({
        ...comment,
        replies: comments.filter((reply) => reply.parentComment?.toString() === comment._id.toString()),
      }));

    return res.status(200).json({
      success: true,
      message: 'Comments fetched successfully',
      data: {
        comments: structuredComments,
        total: comments.length,
      },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message,
    });
  }
};

/**
 * Delete a comment (only owner can delete)
 * DELETE /api/comments/:id
 */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Find comment
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check authorization (only owner can delete)
    if (comment.userid.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own comments',
      });
    }

    // Delete comment
    await Comment.findByIdAndDelete(id);

    // Decrement commentcount on post
    const post = await Post.findById(comment.postid);
    if (post) {
      await Post.findByIdAndUpdate(comment.postid, {
        commentcount: Math.max(0, post.commentcount - 1),
      });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: id });

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message,
    });
  }
};

/**
 * Helper function: Trigger AI reply generation asynchronously
 */
async function triggerAIReply(postid, commentId, userText) {
  try {
    // Fetch the post with its media
    const post = await Post.findById(postid);
    if (!post) return;

    // Get recent comments from the post (last 10)
    const recentComments = await Comment.find({ postid })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('text')
      .lean();

    // Extract comment texts
    const commentTexts = recentComments.map((c) => c.text);

    // Extract image URLs from post media
    const imageUrls = post.media.map((m) => m.url);

    // Clean @cherry mention from user text
    const cleanedText = userText.replace(/@cherry/g, '').trim();

    // Generate AI reply
    const aiReplyText = await generateCommentReply({
      userContent: cleanedText,
      comments: commentTexts,
      imageUrls,
    });

    if (!aiReplyText) {
      console.warn('AI service returned empty reply');
      return;
    }

    // Find AI user (cherry)
    const aiUser = await User.findOne({ username: 'cherry' });
    if (!aiUser) {
      console.warn('AI user (cherry) not found');
      return;
    }

    // Create AI comment as reply
    const aiComment = new Comment({
      postid,
      userid: aiUser._id,
      text: aiReplyText,
      parentComment: commentId,
      isAI: true,
    });

    await aiComment.save();
    console.log('AI reply created successfully:', aiComment._id);
  } catch (error) {
    console.error('Error in triggerAIReply:', error);
  }
}
