import { body, validationResult } from 'express-validator';

const addCommentValidator = [
  body('postid')
    .notEmpty().withMessage('postid is required')
    .isMongoId().withMessage('Invalid post ID'),

  body('text')
    .notEmpty().withMessage('Comment text is required')
    .trim()
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),

  body('parentComment')
    .optional()
    .isMongoId().withMessage('Invalid parent comment ID'),
];

// Validation error handler middleware
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

export default {
  addCommentValidator,
  validateRequest
};
