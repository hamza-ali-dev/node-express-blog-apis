const express = require('express');
const Post = require('../../models/Post');
const { authenticateToken } = require('../../middleware/authMiddleware');
const { authorizeRole } = require('../../middleware/roleMiddleware');
const logger = require('../../utils/logger');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints for managing user posts
 */

/**
 * @swagger
 * /api/user/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post('/', authenticateToken, authorizeRole('user'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({ userId: req.user.id, title, content });
    await newPost.save();

    logger.info(`New post created by user ${req.user.id}: ${newPost._id}`);

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    logger.error(`Error creating post for user ${req.user.id}: ${error.message}`);
    res.status(500).json({ error: 'Error creating post' });
  }
});

/**
 * @swagger
 * /api/user/posts/{id}:
 *   put:
 *     summary: Edit a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
router.put('/:id', authenticateToken, authorizeRole('user'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, content },
      { new: true }
    );

    if (!post) {
      logger.warn(`Failed update attempt by user ${req.user.id} for post ${req.params.id}: Post not found or unauthorized`);
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    logger.info(`Post ${post._id} updated by user ${req.user.id}`);

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    logger.error(`Error updating post ${req.params.id} for user ${req.user.id}: ${error.message}`);
    res.status(500).json({ error: 'Error updating post' });
  }
});

/**
 * @swagger
 * /api/user/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete('/:id', authenticateToken, authorizeRole('user'), async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!post) {
      logger.warn(`Failed delete attempt by user ${req.user.id} for post ${req.params.id}: Post not found or unauthorized`);
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    logger.info(`Post ${post._id} deleted by user ${req.user.id}`);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting post ${req.params.id} for user ${req.user.id}: ${error.message}`);
    res.status(500).json({ error: 'Error deleting post' });
  }
});

/**
 * @swagger
 * /api/user/posts/{id}/comment:
 *   post:
 *     summary: Comment on a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post('/:id/comment', authenticateToken, authorizeRole('user'), async (req, res) => {
  try {
    const { comment } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      logger.warn(`Failed comment attempt by user ${req.user.id} for post ${req.params.id}: Post not found`);
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({ userId: req.user.id, comment });
    await post.save();

    logger.info(`Comment added to post ${post._id} by user ${req.user.id}`);

    res.status(201).json({ message: 'Comment added successfully', post });
  } catch (error) {
    logger.error(`Error adding comment to post ${req.params.id} for user ${req.user.id}: ${error.message}`);
    res.status(500).json({ error: 'Error adding comment' });
  }
});

module.exports = router;
