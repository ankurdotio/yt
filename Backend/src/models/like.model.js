import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure a user can only like a post once
likeSchema.index({ userid: 1, postid: 1 }, { unique: true });
// Index for finding all likes on a post
likeSchema.index({ postid: 1 });
// Index for finding all likes by a user
likeSchema.index({ userid: 1 });

export default mongoose.model('Like', likeSchema);
