import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.js';
import {
  HTTPError,
  ServerError,
  NotFoundError,
  ConflictError,
  BadRequestError,
} from '../errors/index.js';
import { 
  notFoundErrorTextUser,
  serverErrorText,
  badRequestErrorTextUser,
  errorNotUniqueTextUser,
} from '../utils/constants.js'; 

dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

const notFoundError = new NotFoundError(notFoundErrorTextUser);
const serverError = new ServerError(serverErrorText);
const badRequestError = new BadRequestError(badRequestErrorTextUser);
const errorNotUnique = new ConflictError(errorNotUniqueTextUser);
const UniqueErrorCode = 11000;

export function getUserById(req, res, next) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw notFoundError;
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'CastError') {
        next(badRequestError);
      } else {
        next(err);
      }
    });// данные не записались, вернём ошибку
}

export function createUser(req, res, next) {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((userDocument) => {
      const user = userDocument.toObject();
      delete user.password;
      // console.log('user ', user);
      res.send({ data: user });
    })// вернём записанные в базу данные
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.code === UniqueErrorCode) {
        next(errorNotUnique);
      } else if (err.name === 'ValidationError') {
        next(badRequestError);
      } else {
        next(serverError);
      }
    });
}

export function updateUserInfo(req, res, next) {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, email: req.body.email }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError);
      } else {
        next(serverError);
      }
    });// данные не записались, вернём ошибку
}

export function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(next);// ошибка аутентификации
}

export function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw notFoundError;
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError);
      } else {
        next(err);
      }
    });// данные не записались, вернём ошибку
}
