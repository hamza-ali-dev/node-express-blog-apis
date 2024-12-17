const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const { authenticateToken } = require('../../middleware/authMiddleware');
const { authorizeRole } = require('../../middleware/roleMiddleware');
const logger = require('../../utils/logger');

const router = express.Router();

/**
 * @swagger
 * /api/admin/auth/create-admin:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
router.post('/create-admin', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { firstName, lastName, email, password, country } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Attempted to create admin with existing email: ${email}`);
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({ firstName, lastName, email, password: hashedPassword, role: 'admin', isVerified: true, country });
    await newAdmin.save();

    logger.info(`Admin created successfully: ${newAdmin._id} with email ${email}`);

    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (error) {
    logger.error(`Error creating admin: ${error.message}`);
    res.status(500).json({ error: 'Error creating admin' });
  }
});

/**
 * @swagger
 * /api/admin/auth/signin:
 *   post:
 *     summary: Sign in for admins and users
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: signin successful
 *       401:
 *         description: Invalid email or password
 */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn(`Failed signin attempt: Invalid email ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      logger.warn(`Failed signin attempt: Invalid password for email ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET, { expiresIn: '1h' });

    logger.info(`User signed in successfully: ${user._id} with email ${email}`);

    res.status(200).json({ message: 'signin successful', token });
  } catch (error) {
    logger.error(`Error during signin: ${error.message}`);
    res.status(500).json({ error: 'Error during signin' });
  }
});

module.exports = router;
