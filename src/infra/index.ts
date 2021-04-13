import { CashbackService } from '../presentation/services/cashback';
import { CashbackServiceIntegration } from './integrations/cashbackService';

import { ContainerConfig, ServiceContext, IContainer } from '../presentation/typings';
import { AuthService } from '../presentation/services/auth';
import { AccessManagerIntegration } from './integrations/accessManager';
import { KeycloakIntegration } from './integrations/keycloak';

export class Container implements IContainer {
  readonly cashbackService: IContainer['cashbackService'];
  readonly authService: IContainer['authService'];

  constructor(config: ContainerConfig) {
    const serviceContext: ServiceContext = this.createServiceContext(config);
    this.cashbackService = new CashbackService(serviceContext);
    this.authService = new AuthService(serviceContext);
  }

  private createServiceContext(config: ContainerConfig) {
    return {
      cashbackServiceIntegration: new CashbackServiceIntegration({
        baseURL: config.cashbackServiceUrl!,
      }),
      accessManagerIntegration: new AccessManagerIntegration({
        baseURL: config.accessManagerUrl!,
      }),
      keycloakIntegration: new KeycloakIntegration({
        baseURL: config.keycloakUrl!,
      })
    };
  }
}
