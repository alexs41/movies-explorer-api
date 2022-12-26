import { Schema, ObjectId, model } from 'mongoose';
import validator from 'validator';

const movieSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: validator.isURL,
  },
  trailerLink: {
    type: String,
    required: true,
    validate: validator.isURL,
  },
  thumbnail: {
    type: String,
    required: true,
    validate: validator.isURL,
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

export const Movie = model('Movie', movieSchema);
