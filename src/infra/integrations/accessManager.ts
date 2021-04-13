import { AxiosError } from 'axios';
import { HttpIntegration } from '../http';

import { CustomError } from '../../presentation/config/errors';

export class AccessManagerIntegration extends HttpIntegration {
  constructor({ baseURL }: { baseURL: string }) {
    super({ baseURL });
  }

  async getScopes(accessGroup: string, applicationToken: string) {
    return await this.instance
      .request({
        url: `/v1/scopes?groupAccessName=${accessGroup}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${applicationToken}`,
        },
      })
      .catch((err: AxiosError) => {
        throw new CustomError(err);
      });
  }
}
