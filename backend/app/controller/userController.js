import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../validator/userValidator.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const userCtrl = {};

userCtrl.registerUser = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, username, timezone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      username,
      timezone: timezone || 'UTC'
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        message: 'Registration successful. Please log in.'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

userCtrl.loginUser = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {

      const token = jwt.sign(
        {
          userid: user._id,
          role: user.role || 'user'
        },
        process.env.JWT_SECRET || 'secret123',
        { expiresIn: '30d' }
      );

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role || 'user',
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

userCtrl.googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'No credential provided' });

  try {
    const audience = process.env.GOOGLE_CLIENT_ID;
    console.log('Verifying Token with Audience:', audience);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: audience,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const baseUsername = (name.split(' ')[0] + Math.floor(Math.random() * 10000)).toLowerCase().replace(/[^a-z0-9]/g, '');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), salt);

      user = await User.create({
        name,
        email,
        username: baseUsername,
        password: hashedPassword,
        googleId,
        avatar: picture
      });
    }

    const token = jwt.sign(
      { userid: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '30d' }
    );

    const isNewUser = !user.username_updated;

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role || 'user',
      avatar: user.avatar,
      isNew: isNewUser,
      token
    });
  } catch (err) {
    console.error('Google Login Error Detils:', err);
    res.status(400).json({ 
       message: 'Google authentication failed', 
       error: err.message,
       stack: err.stack
    });
  }
};

userCtrl.updateProfile = async (req, res) => {
  try {
    const { _id, name, username, timezone } = req.body;
    let user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check username uniqueness if changed
    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists) return res.status(400).json({ message: 'Username already taken' });
      user.username = username;
    }

    if (name) user.name = name;
    if (timezone) user.timezone = timezone;
    user.username_updated = true;

    await user.save();
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      message: 'Profile updated!'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default userCtrl;
