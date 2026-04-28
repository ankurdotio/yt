# YouTube-like Social Media Backend API

**Host**: `http://localhost:3000`

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Post APIs](#post-apis)
3. [Comment APIs](#comment-apis)
4. [Like APIs](#like-apis)

---

## Authentication APIs

### Register User
**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "Test@123",
  "username": "johndoe"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "username": "johndoe",
    "email": "user@example.com"
  }
}
```

---

### Login User
**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "username": "johndoe",
  "password": "Test@123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "username": "johndoe",
    "email": "user@example.com"
  }
}
```

**Note**: Auth token is stored in HTTP-only cookie (no token in response body)

---

## Post APIs

### Create Post
**Endpoint**: `POST /api/posts`

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "media": [
    {
      "url": "https://example.com/image.jpg",
      "type": "image/jpeg",
      "alt": "A beautiful sunset"
    }
  ],
  "caption": "Amazing sunset today! 🌅"
}
```

**Validation Rules**:
- `media` - Required array with at least 1 item
- `media[].url` - Valid URL
- `media[].type` - One of: `image/png`, `image/jpeg`, `image/webp`, `image/heic`, `image/heif`
- `caption` - Optional, max 2200 characters

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "60f7b3b3e4b0a1b2c3d4e5f6",
    "user": {
      "_id": "60f7b3b3e4b0a1b2c3d4e5f0",
      "username": "johndoe",
      "avatar": "https://example.com/avatar.jpg"
    },
    "media": [
      {
        "url": "https://example.com/image.jpg",
        "alt": "A beautiful sunset",
        "type": "image/jpeg"
      }
    ],
    "caption": "Amazing sunset today! 🌅",
    "likecount": 0,
    "commentcount": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Image Upload via Pixxo

route: /api/posts/upload-image


request_body:{
  image: buffer
}

response_body {
  success: true,
  url: px.pixxo.io/yt-uploads/images/download.png,
  message: "Image uploaded successfully" 
}

---

### Get Feed (Global Timeline)
**Endpoint**: `GET /api/posts`

**Query Parameters**:
- `page` - Page number (default: 1, min: 1)
- `limit` - Posts per page (default: 10, max: 50)

**Example**: `GET /api/posts?page=1&limit=10`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Feed fetched successfully",
  "data": {
    "posts": [
      {
        "_id": "60f7b3b3e4b0a1b2c3d4e5f6",
        "user": {
          "username": "johndoe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "media": [...],
        "caption": "Amazing sunset today! 🌅",
        "likecount": 15,
        "commentcount": 5,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 10,
      "pages": 15
    }
  }
}
```

---

### Get User Posts
**Endpoint**: `GET /api/posts/user/:userId`

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Posts per page (default: 10, max: 50)

**Example**: `GET /api/posts/user/60f7b3b3e4b0a1b2c3d4e5f0?page=1&limit=10`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User posts fetched successfully",
  "data": {
    "posts": [...],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

---

### Get Single Post
**Endpoint**: `GET /api/posts/:id`

**Example**: `GET /api/posts/60f7b3b3e4b0a1b2c3d4e5f6`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Post fetched successfully",
  "data": {
    "_id": "60f7b3b3e4b0a1b2c3d4e5f6",
    "user": {
      "_id": "60f7b3b3e4b0a1b2c3d4e5f0",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Love photography and travel"
    },
    "media": [...],
    "caption": "Amazing sunset today! 🌅",
    "likecount": 15,
    "commentcount": 5,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Delete Post
**Endpoint**: `DELETE /api/posts/:id`

**Authentication**: Required (Bearer token)

**Authorization**: Only post owner can delete

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Error** (403 Forbidden):
```json
{
  "success": false,
  "message": "Unauthorized: You can only delete your own posts"
}
```

---

### Like/Unlike Post (Toggle)
**Endpoint**: `POST /api/posts/:id/like`

**Authentication**: Required (Bearer token)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "post": {
      "_id": "60f7b3b3e4b0a1b2c3d4e5f6",
      "user": {...},
      "media": [...],
      "caption": "Amazing sunset today! 🌅",
      "likecount": 16,
      "commentcount": 5
    },
    "liked": true
  }
}
```

**When unliking**:
```json
{
  "success": true,
  "message": "Post unliked successfully",
  "data": {
    "post": {...},
    "liked": false
  }
}
```

---

## Comment APIs

### Add Comment
**Endpoint**: `POST /api/comments`

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "postid": "60f7b3b3e4b0a1b2c3d4e5f6",
  "text": "This is a great post! @cherry what do you think?",
  "parentComment": null
}
```

**Validation Rules**:
- `postid` - Required, valid MongoDB ID
- `text` - Required, 1-1000 characters
- `parentComment` - Optional, valid MongoDB ID (for replies)

**Features**:
- If text includes `@cherry`, AI bot will automatically generate a reply
- AI reply will be a nested comment under the original comment

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "_id": "60f7b3b3e4b0a1b2c3d4e5f7",
    "postid": "60f7b3b3e4b0a1b2c3d4e5f6",
    "userid": {
      "_id": "60f7b3b3e4b0a1b2c3d4e5f0",
      "username": "johndoe",
      "avatar": "https://example.com/avatar.jpg"
    },
    "text": "This is a great post! @cherry what do you think?",
    "parentComment": null,
    "isAI": false,
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### Add Reply to Comment
**Endpoint**: `POST /api/comments`

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "postid": "60f7b3b3e4b0a1b2c3d4e5f6",
  "text": "I totally agree!",
  "parentComment": "60f7b3b3e4b0a1b2c3d4e5f7"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "_id": "60f7b3b3e4b0a1b2c3d4e5f8",
    "postid": "60f7b3b3e4b0a1b2c3d4e5f6",
    "userid": {...},
    "text": "I totally agree!",
    "parentComment": "60f7b3b3e4b0a1b2c3d4e5f7",
    "isAI": false,
    "createdAt": "2024-01-15T10:36:00.000Z"
  }
}
```

---

### Get Post Comments
**Endpoint**: `GET /api/comments/:postid`

**Example**: `GET /api/comments/60f7b3b3e4b0a1b2c3d4e5f6`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Comments fetched successfully",
  "data": {
    "comments": [
      {
        "_id": "60f7b3b3e4b0a1b2c3d4e5f7",
        "postid": "60f7b3b3e4b0a1b2c3d4e5f6",
        "userid": {
          "username": "johndoe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "text": "This is a great post! @cherry what do you think?",
        "parentComment": null,
        "isAI": false,
        "createdAt": "2024-01-15T10:35:00.000Z",
        "replies": [
          {
            "_id": "60f7b3b3e4b0a1b2c3d4e5f9",
            "userid": {
              "username": "cherry",
              "avatar": "https://example.com/cherry-avatar.jpg"
            },
            "text": "Thank you for the mention! This is really nice content.",
            "isAI": true,
            "createdAt": "2024-01-15T10:35:30.000Z"
          }
        ]
      }
    ],
    "total": 1
  }
}
```

**Note**: Comments are structured with nested replies. Parent comments contain a `replies` array.

---

### Delete Comment
**Endpoint**: `DELETE /api/comments/:id`

**Authentication**: Required (Bearer token)

**Authorization**: Only comment owner can delete

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Note**: Deleting a parent comment also deletes all its replies.

---

## Error Responses

### Validation Error
**Status**: 400 Bad Request

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "media",
      "message": "At least one media item is required"
    }
  ]
}
```

### Not Found
**Status**: 404 Not Found

```json
{
  "success": false,
  "message": "Post not found"
}
```

### Unauthorized
**Status**: 403 Forbidden

```json
{
  "success": false,
  "message": "Unauthorized: You can only delete your own posts"
}
```

### Server Error
**Status**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Error creating post",
  "error": "Internal server error details"
}
```

---

## Features Overview

### Post Features
- ✅ Create posts with multiple images and captions
- ✅ Support for 5 image formats: PNG, JPEG, WEBP, HEIC, HEIF
- ✅ Global feed with pagination
- ✅ User-specific posts
- ✅ Like/Unlike functionality (toggle)
- ✅ Like counter (prevents negative counts)
- ✅ Comment counter (auto-updated)
- ✅ Only post owner can delete

### Comment Features
- ✅ Add comments to posts
- ✅ Nested replies (replies to comments)
- ✅ AI bot integration (@cherry mentions)
- ✅ Comment counter auto-increment
- ✅ Only comment owner can delete
- ✅ Cascade deletion (deleting parent deletes replies)
- ✅ Comment structure with nested replies

### AI Integration
- ✅ Automatic AI reply when `@cherry` is mentioned
- ✅ AI replies are generated asynchronously (non-blocking)
- ✅ AI comments are nested under the original comment
- ✅ AI context includes recent comments and post images

---

## Database Models

### Post Schema
```
- user (ObjectId ref User)
- media (array with url, alt, type)
- caption (string, max 2200)
- likecount (number, min 0)
- commentcount (number, min 0)
- timestamps (createdAt, updatedAt)
```

### Comment Schema
```
- postid (ObjectId ref Post)
- userid (ObjectId ref User)
- text (string, max 1000)
- parentComment (ObjectId ref Comment)
- isAI (boolean)
- timestamps (createdAt, updatedAt)
```

### Like Schema
```
- userid (ObjectId ref User)
- postid (ObjectId ref Post)
- unique index on (userid, postid)
- timestamps (createdAt, updatedAt)
```

---

## Notes
- All timestamps are in ISO 8601 format (UTC)
- Authentication uses HTTP-only cookies for security
- Like counts and comment counts are synced with the database
- AI replies are non-blocking and run in background
- Pagination is 1-indexed (page starts from 1)

