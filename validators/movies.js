import { Joi, Segments } from 'celebrate';
import { celebrate, schemaObjectId, schemaURL } from './common.js';

const schemaCountry = Joi.string().required();
const schemaDirector = Joi.string().required();
const schemaDuration = Joi.number().required();
const schemaYear = Joi.string().required();
const schemaDescription = Joi.string().required();
const schemaImage = schemaURL.required();
const schemaTrailerLink = schemaURL.required();
const schemaThumbnail = schemaURL.required();
const schemaOwner = Joi.object({ id: schemaObjectId }).required();
const schemaMovieId = Joi.string().required();
const schemaNameRU = Joi.string().required();
const schemaNameEN = Joi.string().required();

const schemaParamsMovieId = Joi.object({ id: schemaObjectId }).required();

const schemaBodyMovie = Joi.object({
  country: schemaCountry,
  director: schemaDirector,
  duration: schemaDuration,
  year: schemaYear,
  description: schemaDescription,
  image: schemaImage,
  trailerLink: schemaTrailerLink,
  thumbnail: schemaThumbnail,
  owner: schemaOwner,
  movieId: schemaMovieId,
  nameRU: schemaNameRU,
  nameEN: schemaNameEN,
}).required();

const segmentBodyMovie = { [Segments.BODY]: schemaBodyMovie };
const segmentParamsMovieId = { [Segments.PARAMS]: schemaParamsMovieId };

export const celebrateBodyMovie = celebrate(segmentBodyMovie);
export const celebrateParamsMovieId = celebrate(segmentParamsMovieId);
