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


export { addCommentValidator };
