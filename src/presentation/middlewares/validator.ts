import { AnySchema } from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

export const validatorMiddleware = (schema: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    });

    if (validation.error) {
      return next({
        response: {
          status: 400,
          data: `Invalid request params. ${validation.error}`,
        },
      });
    }

    Object.assign(req, validation.value);

    return next();
  };
};
