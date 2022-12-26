import { Router } from 'express';
import {
  getAllMovies, createMovie, deleteMovie,
} from '../controllers/movies.js';

import {
  celebrateParamsMovieId,
} from '../validators/movies.js';

const movieRoutes = Router();

movieRoutes.get('/', getAllMovies); // возвращает все сохранённые текущим  пользователем фильмы
movieRoutes.post('/', createMovie); // создаёт фильм с переданными в теле
movieRoutes.delete('/:id', celebrateParamsMovieId, deleteMovie); // удаляет сохранённый фильм по id

export default movieRoutes;
