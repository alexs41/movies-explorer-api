import { Joi, Segments } from 'celebrate';
import { celebrate, schemaObjectId, schemaURL } from './common.js';

const schemaMovieId = Joi.object({ id: schemaObjectId }).required();
const schemaName = Joi.string().min(2).max(30).required();
const schemaLink = schemaURL.required();

const schemaCard = Joi.object({
  name: schemaName,
  link: schemaLink,
}).required();

const segmentBodyCard = { [Segments.BODY]: schemaCard };
const segmentParamsMovieId = { [Segments.PARAMS]: schemaMovieId };

export const celebrateBodyCard = celebrate(segmentBodyCard);
export const celebrateParamsMovieId = celebrate(segmentParamsMovieId);
