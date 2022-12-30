import { Joi, Segments } from 'celebrate';
import {
  celebrate,
  schemaObjectId,
} from './common.js';

export const schemaEmail = Joi.string().email().required();
const schemaPassword = Joi.string().required();

// необязательные поля без required
const schemaName = Joi.string().min(2).max(30);

const schemaObjectUserId = Joi.object({
  id: schemaObjectId,
}).required();

const schemaObjectProfile = Joi.object({
  name: schemaName,
}).required();

const schemaObjectAuth = Joi.object({
  email: schemaEmail,
  password: schemaPassword,
}).required();
const schemaObjectUser = schemaObjectAuth // объединяем несколько схем в одну
  .concat(schemaObjectProfile);

const segmentBodyAuth = { [Segments.BODY]: schemaObjectAuth };
const segmentBodyProfile = { [Segments.BODY]: schemaObjectProfile };
const segmentBodyUser = { [Segments.BODY]: schemaObjectUser };
const segmentParamsUserId = { [Segments.PARAMS]: schemaObjectUserId };

export const celebrateBodyAuth = celebrate(segmentBodyAuth);
export const celebrateBodyProfile = celebrate(segmentBodyProfile);
export const celebrateBodyUser = celebrate(segmentBodyUser);
export const celebrateParamsUserId = celebrate(segmentParamsUserId);
