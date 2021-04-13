import { Request, Response, NextFunction } from 'express';

import {
  CustomError,
  NotFound,
  Unauthorized,
  BadRequest,
  InternalServerError,
  Conflict,
  BadGateway,
  Forbidden,
} from '../config/errors';
import { Logger as logger } from '../config/logger';

export const errorHandlerMiddleware = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  let status = 500;
  let throwErr: any;

  function translate(code: number, message: string, errorDetails: any = null) {
    let translated: string;
    let translatedDefault = null;

    switch (code) {
      case 500:
        translatedDefault = 'Algo de errado aconteceu. Falha interna.';
        break;
      case 401:
        translatedDefault = 'Algo de errado aconteceu. Falha interna.';

        if (errorDetails && errorDetails.error === 'invalid_grant') {
          translatedDefault = 'E-mail ou senha inválidos.';
        }
        break;
    }
    switch (message) {
      case 'No record found':
        translated = 'Nenhum registro encontrado.';
        break;
      case 'resource not found.':
        translated = 'Usuário sem permissão de acesso.';
        break;
      case 'Bad Request. Missing or incorrect values':
        translated = 'Requisição Inválida. Valores incorretos ou incompletos.';
        break;
      case 'No record found with these parameters':
        translated = 'Nenhum registro encontrado com os parâmetros enviados.';
        break;
      case 'Invalid request params':
        translated = 'Parâmetros de requisição inválidos.';
        break;
      case 'Platform claim not found in user-info token':
        translated =
          'Plataforma não encontrada. Entre em contato com o suporte';
        break;
      default:
        translated = translatedDefault ? translatedDefault : message;
        break;
    }
    return translated;
  }

  if (err.name === 'TypeError') {
    switch (err.code) {
      case 'ERR_HTTP_INVALID_HEADER_VALUE':
        status = 400;
        throwErr = new BadRequest(
          'Bad Request. Missing or incorrect values.',
          err.message,
        );
        break;
      case 'ER_DUP_ENTRY':
        status = 409;
        throwErr = new Conflict(
          'Already exists resource with received unique keys',
          err.message,
        );
        break;
      default:
        throwErr = new InternalServerError(
          'Internal Failure.',
          err.response?.data ? err.response?.data : err.message,
        );
    }
  } else {
    switch (err.response?.status) {
      case null:
        throwErr = new BadGateway('End server is down', [
          new CustomError(
            'END_SERVER_DOWN',
            'Failed to execute the request as a proxy. Contact the service provider.',
          ),
        ]);
        break;

      case 400:
        status = 400;
        throwErr = new BadRequest(
          err.response?.data?.details?.message
            ? translate(status, err.response?.data?.details?.message)
            : err.response?.data?.message
            ? translate(status, err.response?.data?.message)
            : 'Valores incorretos ou incompletos.',
          err.response?.data.details
            ? err.response?.data.details
            : 'Valores incorretos ou incompletos.', // err.response?.data,
        );
        break;

      case 401:
        status = 401;

        throwErr = new Unauthorized(
          err.response?.data?.details?.message
            ? translate(status, err.response?.data?.details?.message)
            : err.response?.data?.message
            ? translate(status, err.response?.data?.message)
            : translate(
                status,
                err.response?.data?.message,
                err.response?.data,
              ),
          err.response?.data?.details
            ? err.response?.data?.details
            : err.response?.data,
        );
        break;

      case 403:
        status = 403;

        throwErr = new Forbidden(
          err.response?.data?.details?.message
            ? translate(status, err.response?.data?.details?.message)
            : err.response?.data?.message
            ? translate(status, err.response?.data?.message)
            : 'Você não possui permissão de acesso.',
          err.response?.data?.details
            ? err.response?.data.details
            : err.response?.data,
        );
        break;

      case 404:
        status = 404;
        throwErr = new NotFound(
          err.response?.data?.details?.message
            ? translate(status, err.response?.data?.details?.message)
            : err.response?.data?.message
            ? translate(status, err.response?.data?.message)
            : 'Recurso não encontrado.',
          err.response?.data?.details
            ? err.response?.data?.details
            : err.response?.data,
        );
        break;

      case 409:
        status = 409;
        throwErr = new Conflict(
          err.response?.data?.details?.message
            ? translate(status, err.response?.data?.details?.message)
            : err.response?.data?.message
            ? translate(status, err.response?.data?.message)
            : 'O recurso já existe.',
          err.response?.data?.details
            ? err.response?.data?.details
            : err.response?.data,
        );
        break;

      default:
        status = 500;
        const errorCustomCode = err.code?.response?.data?.details?.message;
        throwErr = new InternalServerError(
          err.response?.data?.details?.message
            ? translate(status, err.response?.data?.details?.message)
            : err.response?.data?.message
            ? translate(status, err.response?.data?.message)
            : translate(status, errorCustomCode) || 'Falha interna.',
          err.response?.data?.details
            ? err.response?.data?.details
            : err.response?.data,
        );
    }
  }

  if (status !== 500) {
    logger.warn(err);
  } else {
    logger.error(err);
  }

  return res.status(status).send(throwErr.toJSON());
};
