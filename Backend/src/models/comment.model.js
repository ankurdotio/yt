import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    postid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
      trim: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    isAI: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for finding comments by post
commentSchema.index({ postid: 1, createdAt: -1 });
// Index for finding replies to a comment
commentSchema.index({ parentComment: 1 });
// Index for finding comments by user
commentSchema.index({ userid: 1 });

export default mongoose.model('Comment', commentSchema);
