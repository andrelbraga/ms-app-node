import { AxiosError } from 'axios';
import { HttpIntegration } from '../http';

import qs from 'qs';
import env from '../../presentation/config/env';

const {
  realmPhi,
  phiClientId,
  phiClientSecret
} = env;

export class KeycloakIntegration extends HttpIntegration {
  constructor({ baseURL }: { baseURL: string }) {
    super({ baseURL });
  }

  async getClientCredentials(scopes?: any) {
    return await this.instance
      .request({
        url: `/auth/realms/${realmPhi}/protocol/openid-connect/token`,
        method: 'post',
        data: qs.stringify({
          grant_type: 'client_credentials',
          client_id: phiClientId,
          client_secret: phiClientSecret,
          scope: scopes,
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }
  async getClientCredentialsDefault() {
    return await this.instance
      .request({
        url: `/auth/realms/${realmPhi}/protocol/openid-connect/token`,
        method: 'post',
        data: qs.stringify({
          grant_type: 'client_credentials',
          client_id: phiClientId,
          client_secret: phiClientSecret,
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }
}
