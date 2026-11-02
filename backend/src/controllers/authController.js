import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail, USER_ROLES, User } from '../models/userModel.js';
import { signAccessToken } from '../middleware/authMiddleware.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(request, response, next) {
  try {
    const name = typeof request.body.name === 'string' ? request.body.name.trim() : '';
    const email = typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const password = typeof request.body.password === 'string' ? request.body.password : '';
    const role = typeof request.body.role === 'string' ? request.body.role : 'receptionist';
    const staffId = typeof request.body.staffId === 'string' ? request.body.staffId.trim() : undefined;

    if (!name || name.length > 120 || !EMAIL_PATTERN.test(email) || password.length < 12 || password.length > 72
        || !USER_ROLES.includes(role) || (staffId && staffId.length > 80)) {
      return response.status(400).json({ error: 'Provide valid account details and a supported staff role.' });
    }
    if (await findUserByEmail(email)) {
      return response.status(409).json({ error: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({ name, email, passwordHash, role, staffId });
    return response.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
}

export async function login(request, response, next) {
  try {
    const email = typeof request.body.email === 'string' ? request.body.email.trim().toLowerCase() : '';
    const password = typeof request.body.password === 'string' ? request.body.password : '';
    if (!EMAIL_PATTERN.test(email) || !password) {
      return response.status(400).json({ error: 'Provide a valid email and password.' });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) {
      return response.status(401).json({ error: 'Email or password is incorrect.' });
    }
    await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      staffId: user.staffId,
    };
    return response.json({
      success: true,
      message: 'Login successful.',
      user: safeUser,
      accessToken: signAccessToken(user),
    });
  } catch (error) {
    return next(error);
  }
}
