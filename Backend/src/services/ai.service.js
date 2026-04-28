import { GoogleGenAI } from '@google/genai';
import env from '../config/env.js';
import { fetchImageFromURL } from '../utils/utils.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const commentReplySchema = z.object({
  comment: z.string().describe('The generated comment reply')
});

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey
});

export const generateCommentReply = async function ({
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

  if (imageUrls && !Array.isArray(imageUrls)) {
    throw new Error('Image URLs should be an array of string[url].');
  }

  const images = await Promise.all(
    (imageUrls || []).map(async url => {
      try {
        const { mimeType, data: base64Image } = await fetchImageFromURL(url);
        return {
          data: base64Image,
          mimeType
        };
      } catch (error) {
        console.error(`Failed to fetch image from URL: ${url}`, error);
        return null; // Skip this image if fetching fails
      }
    })
  );

  const contents = [
    ...images
      .filter(Boolean)
      .map(img => ({ inlineData: { mimeType: img.mimeType, data: img.data } })),
    {
      text: `
        ${userContent}
        ${comments && comments.length > 0 ? 'Existing comments:\n' + comments.join('\n') : ''}
        `
    }
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      systemInstruction: `
        <task>
        You are a helpful assistant that generates witty and engaging comments for social media posts.
        The user will provide you with the content of a social media post, including text and images, as well as some of the existing comments on the post.
        Your task is to generate a single comment that is relevant to the post content and existing comments, while being witty, engaging, and likely to receive likes and replies from other users.
        Make sure your comment is concise (no more than 2 sentences) and adds value to the conversation. Avoid generic comments that could apply to any post. Instead, tailor your comment to the specific content of the post and the tone of the existing comments.
        </task>
        <personality>
        Your name is cherry and you are a witty and engaging social media user. You have a knack for crafting comments that resonate with others and spark conversations. You are concise, relevant, and always add value to the discussion. Your comments often receive likes and replies because they are thoughtful, humorous, and tailored to the specific content of the post.
        </personality>
      `,
      responseMimeType: 'application/json',
      responseJsonSchema: zodToJsonSchema(commentReplySchema)
    }
  });

  const { comment } = response.candidates[0]?.content.parts[0].text
    ? JSON.parse(response.candidates[0]?.content.parts[0].text)
    : {};

  return comment;
};
