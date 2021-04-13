import { Request, Response, NextFunction } from 'express';
import { Logger as logger } from '../config/logger';
import { AuthService } from '../../presentation/services/auth';

const getClientCredentials = (authService: AuthService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { 'user-info': userInfo } = req.headers;
      const userToken = userInfo?.toString().split(' ')[1];
      Object.defineProperty(res.locals, 'userToken', {
        value: userToken,
        enumerable: true,
      });

      const accessGroup = await authService.getAccessGroup(userToken);
      const verifyTokenByAccessGroup = await authService.verifyToken(
        accessGroup,
      );
      const verifyTokenByDefault = await authService.verifyToken('default');
      let applicationToken;
      let expirationTime;

      if (!verifyTokenByAccessGroup) {
        if (!verifyTokenByDefault) {
          const clientCredentials = await authService.getClientCredentials();
          const {
            // tslint:disable-next-line: no-shadowed-variable
            access_token,
            // tslint:disable-next-line: no-shadowed-variable
            expires_in,
          } = clientCredentials;

          applicationToken = access_token;
          expirationTime = expires_in;
          await authService.storeToken(
            'default',
            applicationToken,
            expirationTime,
          );
        } else {
          applicationToken = await authService.getStoredToken('default');
        }

        let scopes = await authService.getScopes(accessGroup, applicationToken);
        scopes = scopes.join(' ');
        const scopedClientCredentials = await authService.getClientCredentials(
          scopes,
        );
        const { access_token, expires_in } = scopedClientCredentials;

        applicationToken = access_token;
        expirationTime = expires_in;

        await authService.storeToken(
          accessGroup,
          applicationToken,
          expirationTime,
        );
      } else {
        applicationToken = await authService.getStoredToken(accessGroup);
      }

      Object.defineProperty(res.locals, 'scopedApplicationToken', {
        value: applicationToken,
        enumerable: true,
      });

      return next();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
};

export { getClientCredentials };
