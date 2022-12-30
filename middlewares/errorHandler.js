import { constants } from 'http2';

export default function errorHandler(err, req, res, next) {
  const status = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = err.message || 'Неизвестная ошибка';
  res.status(status).send({ message });
  next();
}
