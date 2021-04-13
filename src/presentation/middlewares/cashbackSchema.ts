import joi from '@hapi/joi';

export const cashbackSchema = joi.object({
  headers: joi.object({
    'user-info': joi.string().required(),
  }),
});
