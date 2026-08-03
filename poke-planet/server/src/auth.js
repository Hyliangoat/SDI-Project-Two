import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { HttpError } from './errors.js';

export function createToken(user) {
  return jwt.sign({ sub: String(user.id), username: user.username }, config.jwtSecret, {
    expiresIn: '8h',
    issuer: 'poke-planets-api',
  });
}

export function requireAuth(request, _response, next) {
  const header = request.get('authorization') ?? '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next(new HttpError(401, 'Authentication required.'));
  try {
    const payload = jwt.verify(token, config.jwtSecret, { issuer: 'poke-planets-api' });
    request.user = { id: Number(payload.sub), username: payload.username };
    return next();
  } catch {
    return next(new HttpError(401, 'Invalid or expired token.'));
  }
}