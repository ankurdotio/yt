import { GoogleGenAI } from '@google/genai';
import env from '../config/env.js';

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey
});

const generateCommentReply = async function ({
  userContent,
  comments,
  imageUrls
}) {
  if (!userContent) {
    throw new Error('User content is required to generate a comment reply.');
  }

  if (comments && !Array.isArray(comments)) {
    throw new Error('Comments should be an array of string.');
  }
};
