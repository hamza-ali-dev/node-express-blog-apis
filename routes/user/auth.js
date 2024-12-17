const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const logger = require('../../utils/logger');
const sendEmail = require('../../utils/sendEmail'); // Utility to send emails
const crypto = require('crypto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/user/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - firstName
 *               - email
 *               - country
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's last name
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               country:
 *                 type: string
 *                 description: The user's country
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *     responses:
 *       201:
 *         description: User created successfully. Verification email sent.
 *       500:
 *         description: Error creating user
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, firstName, email, country, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      name,
      firstName,
      email,
      country,
      password: hashedPassword,
      verificationToken,
    });

    await user.save();

    // Create a verification link
    const verificationLink = `${req.protocol}://${req.get('host')}/api/user/auth/verify/${verificationToken}`;

    // Send verification email
    await sendEmail({
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    });

    logger.info(`User signed up successfully: ${email}`);

    res.status(201).send({ message: 'User created. Verify your email.' });
  } catch (error) {
    logger.error(`Error signing up user: ${error.message}`);
    res.status(500).send({ error: 'Error creating user.' });
  }
});

/**
 * @swagger
 * /api/user/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Error signing in user
 */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Failed sign-in attempt: Invalid email ${email}`);
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      logger.warn(`Failed sign-in attempt: Unverified email ${email}`);
      return res.status(401).send({ error: 'Please verify your email before signing in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Failed sign-in attempt: Invalid password for email ${email}`);
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET, { expiresIn: '1h' });

    logger.info(`User signed in successfully: ${user.email}`);

    res.status(200).json({ token });
  } catch (error) {
    logger.error(`Error during sign-in: ${error.message}`);
    res.status(500).send({ error: 'Error signing in user.' });
  }
});

router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send({ error: 'Invalid or expired verification token.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Remove the token after verification

    await user.save();

    res.status(200).send({ message: 'Email verified successfully. You can now sign in.' });
  } catch (error) {
    logger.error(`Error verifying email: ${error.message}`);
    res.status(500).send({ error: 'Error verifying email.' });
  }
});

module.exports = router;
