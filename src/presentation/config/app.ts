import { HttpServer } from '..';
import { Logger as logger } from './logger';
import { Container } from '../../infra';
import { AppConfig } from '../typings';
import env from './env';


export class Application {
  private readonly config: AppConfig;
  private httpServer?: HttpServer;

  constructor(config: AppConfig) {
    this.config = config;
  }

  private getHttpServer(): HttpServer {
    if (!this.httpServer) {
      throw new Error('Failed to start HTTP server');
    }
    return this.httpServer;
  }

  private setupHttpServer(container: Container): void {
    this.httpServer = new HttpServer(container, this.config);
  }

  private async initServers(): Promise<void> {
    const httpServer = this.getHttpServer();
    httpServer.start();
    logger.info(`HTTP server started in port ${httpServer.port}`);
  }

  async start(): Promise<void> {
    const container = new Container({
      cashbackServiceUrl: env.cashbackServiceUrl,
      accessManagerUrl: env.accessManagerUrl,
      keycloakUrl: env.keycloakUrl,
    });
    this.setupHttpServer(container);
    await this.initServers();
  }
}
