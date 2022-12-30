import { Router } from 'express';
import { celebrateBodyAuth, celebrateBodyUser } from '../validators/users.js';
import { login, createUser } from '../controllers/users.js';
import auth from '../middlewares/auth.js';
import userRoutes from './users.js';
import movieRoutes from './movies.js';
import { NotFoundError } from '../errors/NotFoundError.js';

const routes = Router();

routes.post('/signin', celebrateBodyAuth, login);
routes.post('/signup', celebrateBodyUser, createUser);
routes.use(auth); // авторизация
routes.use('/users', userRoutes);
routes.use('/movies', movieRoutes);

// routes.use('/cards', cardRoutes);

routes.all('/*', () => {
  throw new NotFoundError('Страницы не существует');
});

export default routes;
