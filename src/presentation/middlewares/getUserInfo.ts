import { Request, Response, NextFunction } from 'express';

import axios from 'axios';
import { promisify } from 'util';
import jsonwebtoken from 'jsonwebtoken';
import { InternalServerError, Unauthorized } from '../config/errors';
import env from '../config/env';

const getPublicKey = async () => {
  try {
    const publicKeyStartLine = '-----BEGIN PUBLIC KEY-----';
    const publicKeyEndLine = '-----END PUBLIC KEY-----';

    const realmData = await axios.get(
      `${env.keycloakUrl}/auth/realms/${env.keycloakRealm}`,
    );

    return `${publicKeyStartLine}\n${realmData.data.public_key}\n${publicKeyEndLine}`;
  } catch (err) {
    throw new InternalServerError('Request to KeyCloack failed', err);
  }
};

const asyncVerifyJwt = (token: string, publicKey: string) => {
  return promisify(jsonwebtoken.verify)(token, publicKey);
};
export const getUserInfo = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userInfo = req.get('user-info');
      const userInfoToken = userInfo?.split('Bearer ')[1] || '';

      const publicKey = await getPublicKey();

      const { platform }: any = await asyncVerifyJwt(userInfoToken, publicKey);

      if (!platform) {
        return next({
          response: {
            data: {
              message: 'Platform claim not found in user-info token',
              status: 500,
            },
          },
        });
      }

      Object.assign(res.locals, {
        platform,
      });

      return next();
    } catch (err) {
      const jwtErrors = [
        'TokenExpiredError',
        'JsonWebTokenError',
        'NotBeforeError',
      ];

      let errorResponse = err;

      if (jwtErrors.includes(err.name) || err instanceof Unauthorized) {
        errorResponse = new Unauthorized(err.message, err);
      }

      return next(errorResponse);
    }
  };
};
