import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    media: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          alt: {
            type: String,
            default: '',
          },
        },
      ],
      required: true,
      minlength: 1,
    },
    caption: {
      type: String,
      default: '',
      maxlength: 2200,
    },
    likecount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentcount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Index for finding posts by user and sorting by creation date
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

export default mongoose.model('Post', postSchema);
