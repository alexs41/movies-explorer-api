import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { UnauthorizedError } from '../errors/index.js';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Ошибка авторизации. Неверный email или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Ошибка авторизации. Неверный email или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

export const User = model('User', userSchema);
