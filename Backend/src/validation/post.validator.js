import { body, validationResult } from 'express-validator';

const ALLOWED_MEDIA_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];

const createPostValidator = [
  body('media')
    .notEmpty().withMessage('Media array is required')
    .isArray({ min: 1 }).withMessage('At least one media item is required'),

  body('media.*.url')
    .notEmpty().withMessage('Each media item must have a URL')
    .isURL().withMessage('Invalid URL format'),

  body('media.*.type')
    .optional()
    .isIn(ALLOWED_MEDIA_TYPES).withMessage(`Media type must be one of: ${ALLOWED_MEDIA_TYPES.join(', ')}`),

  body('caption')
    .optional()
    .isString().withMessage('Caption must be a string')
    .trim()
    .isLength({ max: 2200 }).withMessage('Caption must be 2200 characters or less'),
];


export { createPostValidator };
