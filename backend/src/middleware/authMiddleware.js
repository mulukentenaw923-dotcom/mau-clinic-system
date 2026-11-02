import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters.');
  }
  return secret;
}

export function signAccessToken(user) {
  const userId = user._id ?? user.id;
  if (!userId || !user.role) throw new Error('A user ID and role are required to issue an access token.');
  return jwt.sign({ sub: String(userId), role: user.role }, getJwtSecret(), { expiresIn: '8h' });
}

export function requireAuth(request, response, next) {
  const [scheme, token] = (request.get('authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ error: 'Authentication is required.' });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload === 'string' || !mongoose.isValidObjectId(payload.sub) || !payload.role) {
      return response.status(401).json({ error: 'Invalid access token.' });
    }
    request.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return response.status(401).json({ error: 'Invalid or expired access token.' });
  }
}

export function requireRole(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ error: 'You do not have permission to perform this action.' });
    }
    return next();
  };
}
