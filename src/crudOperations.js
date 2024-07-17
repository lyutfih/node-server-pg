// Import utility functions
import yup from 'yup';
import { processBodyFromRequest, returnErrorWithMessage } from './utils.js';
import client from './config/db.js';
import postSchema from './validators/postsValidator.js';

export const createPost = async (req, res) => {
  try {
    const body = await processBodyFromRequest(req);
    if (!body) return returnErrorWithMessage(res, 400, 'Body is required');
    const parsedBody = JSON.parse(body);
    await postSchema.validate(parsedBody, { abortEarly: false });
    console.log('Here we have access to the body: ', parsedBody);
    await client.query('INSERT INTO posts (title, author, content) VALUES ($1, $2, $3);', [parsedBody.title, parsedBody.author, parsedBody.content]);
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Post created', post: parsedBody }));
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errorMessages = error.errors.join(', ');
      returnErrorWithMessage(res, 400, errorMessages);
    } else {
      returnErrorWithMessage(res);
    }
  }
};

export const getPosts = async (req, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM posts;');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rows));
  } catch (error) {
    console.error('Error fetching posts: ', error);
    returnErrorWithMessage(res);
  }
};

export const getPostById = async (req, res) => {
  try {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Post fetched', post: req.post }));
  } catch (error) {
    console.error('Error fetching post: ', error);
    returnErrorWithMessage(res);
  }
};

export const updatePost = async (req, res) => {
  try {
    const body = await processBodyFromRequest(req);
    if (!body) return returnErrorWithMessage(res, 400, 'Body is required');
    const parsedBody = JSON.parse(body);
    await postSchema.validate(parsedBody, { abortEarly: false });
    const updatedPost = await client.query('UPDATE posts SET title = $1, author = $2, content = $3 WHERE id = $4 RETURNING *', [parsedBody.title, parsedBody.author, parsedBody.content, req.post.id]);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Post updated', post: updatedPost.rows[0] }));
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errorMessages = error.errors.join(', ');
      returnErrorWithMessage(res, 400, errorMessages);
    } else {
      returnErrorWithMessage(res);
    }
  }
};

export const deletePost = async (req, res) => {
  try {
    await client.query('DELETE FROM posts WHERE id = $1;', [req.post.id]);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Post deleted', post: req.post }));
  } catch (error) {
    console.error('Error deleting post: ', error);
    returnErrorWithMessage(res);
  }
};
