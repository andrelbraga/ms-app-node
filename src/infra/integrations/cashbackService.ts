import { AxiosError } from 'axios';
import { HttpIntegration } from '../http';

import {
  listCampaignFilters,
  listCampaignParams,
  getCampaignParams,
  paymentSlipCashbackActive,
} from '../../domain/models/cashback';

export class CashbackServiceIntegration extends HttpIntegration {
  constructor({ baseURL }: { baseURL: string }) {
    super({ baseURL });
  }

  /* cashback - begin */
  async listCampaign(
    params: listCampaignParams,
    filters: listCampaignFilters,
    platform: any,
    scopedApplicationToken: any,
    userToken: any,
  ) {
    const { limit, page } = params;

    return await this.instance
      .request({
        url: '/campaigns',
        method: 'get',
        headers: {
          Authorization: `Bearer ${scopedApplicationToken}`,
          'User-info': `Bearer ${userToken}`,
        },
        params: { limit, page, ...filters },
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }
  async getCampaign(
    requestParams: getCampaignParams,
    scopedApplicationToken: any,
    userToken: any,
  ) {
    const id = requestParams;
    return await this.instance
      .request({
        url: `/campaigns/${id}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${scopedApplicationToken}`,
          'User-info': `Bearer ${userToken}`,
        },
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }
  async postCampaign(body: any, scopedApplicationToken: any, userToken: any) {
    return await this.instance
      .request({
        url: '/campaigns',
        method: 'post',
        data: {
          ...body,
          sponsor: {
            document: body.sponsor.document,
          },
        },
        headers: {
          Authorization: `Bearer ${scopedApplicationToken}`,
          'User-info': `Bearer ${userToken}`,
        },
      })
      .catch(err => {
        throw err;
      });
  }
  async putCampaign(
    requestParams: getCampaignParams,
    scopedApplicationToken: any,
    userToken: any,
  ) {
    const { id } = requestParams;
    return await this.instance
      .request({
        url: `/campaigns/${id}/suspend`,
        method: 'put',
        headers: {
          Authorization: `Bearer ${scopedApplicationToken}`,
          'User-info': `Bearer ${userToken} `,
        },
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }
  async patchCampaign(
    requestParams: getCampaignParams,
    body: any,
    scopedApplicationToken: any,
    userToken: any,
  ) {
    const { id } = requestParams;
    return await this.instance
      .request({
        url: `/campaigns/${id}`,
        method: 'patch',
        data: body,
        headers: {
          Authorization: `Bearer ${scopedApplicationToken}`,
          'User-info': `Bearer ${userToken} `,
        },
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }
  async getActiveCampaign(
    { paymentType }: paymentSlipCashbackActive,
    scopedApplicationToken: any,
    userToken: any,
  ) {
    return await this.instance
      .request({
        url: '/campaigns/active',
        method: 'get',
        headers: {
          Authorization: `Bearer ${scopedApplicationToken}`,
          'User-info': `Bearer ${userToken}`,
        },
        params: {
          paymentType: paymentType || 'PEER_TO_PEER',
        },
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }
  async rescheduleCampaign(
    requestParams: getCampaignParams,
    body: any,
    scopedApplicationToken: any,
    userToken: any,
  ) {
    const { id } = requestParams;
    return await this.instance
      .request({
        url: `/campaigns/${id}/reschedule`,
        method: 'patch',
        data: body,
        headers: {
          Authorization: `Bearer ${scopedApplicationToken}`,
          'User-info': `Bearer ${userToken} `,
        },
      })
      .catch((err: AxiosError) => {
        throw err;
      });
  }
  /* cashback - end */
}
