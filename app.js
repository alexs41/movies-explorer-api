import express from 'express';
import helmet from 'helmet';
import { connect, disconnect, mongoose } from 'mongoose';
import { errors } from 'celebrate';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import rateLimit from 'express-rate-limit';
import rateLimitConfig from './utils/rateLimiterConfig.js';

mongoose.set('strictQuery', false);

const { PORT, dbName, DB_PATH } = process.env;
const limiter = rateLimit(rateLimitConfig);

export const run = async () => {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const app = express();
  app.use(limiter);
  app.use(helmet());
  app.use(cors(
    {
      origin: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  ));

  app.use(bodyParser.json());
  app.use(cookieParser()); // подключаем парсер кук как мидлвэр

  connect(`${DB_PATH}${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, (err) => {
    if (err) throw err;
    console.log('Connected to MongoDB!!!');
  });

  app.use(requestLogger); // подключаем логгер запросов

  app.use(routes);

  app.use(errorLogger); // подключаем логгер ошибок
  app.use(errors()); // обработчик ошибок celebrate
  app.use(errorHandler); // централизованный обработчик ошибок

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`); // Если всё работает, консоль покажет, какой порт приложение слушает
  });

  const stop = async () => {
    await disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
};
