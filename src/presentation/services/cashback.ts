import { ServiceContext } from '../typings';
import {
  listCampaignParams,
  listCampaignFilters,
  paymentSlipCashbackActive,
} from '../../domain/models/cashback';

export class CashbackService {
  private readonly cashbackServiceIntegration: ServiceContext['cashbackServiceIntegration'];
  constructor(context: ServiceContext) {
    this.cashbackServiceIntegration = context.cashbackServiceIntegration;
  }

  async list(
    params: listCampaignParams,
    filters: listCampaignFilters,
    platform: any,
    scopedApplicationToken: any,
    userToken: any,
  ) {
    try {
      const response = await this.cashbackServiceIntegration.listCampaign(
        params,
        filters,
        platform,
        scopedApplicationToken,
        userToken,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post(body: object, scopedApplicationToken: any, userToken: any) {
    try {
      await this.cashbackServiceIntegration.postCampaign(
        body,
        scopedApplicationToken,
        userToken,
      );
    } catch (error) {
      return error;
    }
  }

  async put(params: any, scopedApplicationToken: any, userToken: any) {
    try {
      await this.cashbackServiceIntegration.putCampaign(
        params,
        scopedApplicationToken,
        userToken,
      );
    } catch (error) {
      throw error;
    }
  }

  async get(params: any, scopedApplicationToken: any, userToken: any) {
    try {
      const response = await this.cashbackServiceIntegration.getCampaign(
        params,
        scopedApplicationToken,
        userToken,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async patch(
    params: any,
    body: object,
    scopedApplicationToken: any,
    userToken: any,
  ) {
    try {
      await this.cashbackServiceIntegration.patchCampaign(
        params,
        body,
        scopedApplicationToken,
        userToken,
      );
    } catch (error) {
      throw error;
    }
  }

  async getActive({ paymentType }: paymentSlipCashbackActive , scopedApplicationToken: any, userToken: any) {
    try {
      const response = await this.cashbackServiceIntegration.getActiveCampaign(
        { paymentType },
        scopedApplicationToken,
        userToken,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async reschedule(
    params: any,
    body: object,
    scopedApplicationToken: any,
    userToken: any,
  ) {
    try {
      await this.cashbackServiceIntegration.rescheduleCampaign(
        params,
        body,
        scopedApplicationToken,
        userToken,
      );
    } catch (error) {
      throw error;
    }
  }
}
