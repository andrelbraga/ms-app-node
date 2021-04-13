import { Router } from 'express';
import { AnySchema } from '@hapi/joi';
/* services */
import { CashbackService } from '../services/cashback';
import { AuthService } from '../services/auth'
/* integrations */
import { AccessManagerIntegration } from '../../infra/integrations/accessManager';
import { KeycloakIntegration } from '../../infra/integrations/keycloak';
import { CashbackServiceIntegration } from '../../infra/integrations/cashbackService';

declare global {
  namespace jest {
    // tslint:disable-next-line: interface-name
    interface Matchers<R, T> {
      /**
       * Checks if the object matches the schema
       * @param schema Joi schema
       */
      toMatchSchema(schema: AnySchema): R;
    }
  }
}
export type Nullable<T> = T | undefined | null;
export type UUID<T> = T;

type Env = {
  readonly apiVersion?: string
  readonly httpPort: number;
  readonly httpBodyLimit: string;
  readonly cashbackServiceUrl?: string;
  
  readonly accessManagerUrl?: string;
  readonly keycloakUrl?: string;
  readonly keycloakRealm?: string;
  readonly realmPhi?: string;
  readonly phiClientId?: string;
  readonly phiClientSecret?: string;

  readonly realmBackoffice?: string;
  readonly backofficeClientId?: string;
  readonly backofficeClientSecret?: string;
};

export type AppConfig = {
  port: Env['httpPort'];
  bodyLimit: Env['httpBodyLimit'];
};

export type HttpServerConfig = {
  port: Env['httpPort'];
  bodyLimit: Env['httpBodyLimit'];
};

interface ICodedError {
  message: string;
  code: string;
  details?: object;
}

export interface IContainer {
  readonly cashbackService: CashbackService;
  readonly authService: AuthService;
}

export type ServiceContext = {
  cashbackServiceIntegration: CashbackServiceIntegration;
  accessManagerIntegration: AccessManagerIntegration;
  keycloakIntegration: KeycloakIntegration;
};

export type ContainerConfig = {
  cashbackServiceUrl: Env['cashbackServiceUrl'];
  accessManagerUrl: Env['accessManagerUrl'];
  keycloakUrl: Env['keycloakUrl'];
};

export interface IController {
  register(router: Router): void;
}
