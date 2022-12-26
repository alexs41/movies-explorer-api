import { Movie } from '../models/movie.js';
import {
  ServerError,
  NotFoundError,
  BadRequestError,
} from '../errors/index.js';

const notFoundError = new NotFoundError('Фильм не найдена');
const serverError = new ServerError('Произошла ошибка сервера');
const badRequestError = new BadRequestError('Некорректные данные.');

export function getAllMovies(req, res, next) {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(() => next(serverError));
}

export function createMovie(req, res, next) {
  const {
    country, director, duration, year, description, image, trailerLink, thumbnail, movieId,
    nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send({ data: movie }))// вернём записанные в базу данные
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(badRequestError);
      } else {
        next(serverError);
      }
    });// данные не записались, вернём ошибку
}

export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      throw notFoundError;
    } else {
      res.send(await Movie.findOneAndRemove({ _id: req.params.id }));
    }
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(badRequestError);
    } else {
      next(err);
    }
  }
};
