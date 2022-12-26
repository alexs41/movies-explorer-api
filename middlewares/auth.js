import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UnauthorizedError } from '../errors/index.js';

dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

const unauthorizedError = new UnauthorizedError('Ошибка авторизации');

export default function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    next(unauthorizedError);
    return '';
  }

  const token = authorization.replace(/Bearer*\s*/i, '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    next(unauthorizedError);
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
  return '';
}
