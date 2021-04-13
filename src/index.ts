import './presentation/helpers/elasticApm';
import { Logger as logger } from './presentation/config/logger';
import { Application } from './presentation/config/app';
import { AppConfig } from './presentation/typings';
import env from './presentation/config/env';

const appConfig: AppConfig = {
  port: env.httpPort,
  bodyLimit: env.httpBodyLimit,
};

const application = new Application(appConfig);

setImmediate(async () => {
  await application.start();
  logger.info('Application started');
});
