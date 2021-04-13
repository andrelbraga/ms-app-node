export type listCampaignParams = {
  limit: string;
  page: string;
};

export type listCampaignFilters = {
  id: string;
  platformName: string;
};

export type getCampaignParams = {
  id: string;
  platformName: string;
};

export type postCampaignParams = {
  name: string;
  startsAt: string;
  endsAt: string;
  cashback: {
    maximumPaymentValue: number;
    percentage: string;
  };
  platform: {
    name: string;
  };
  sponsor: {
    document: string;
  };
};

export type paymentSlipCashbackActive = {
  paymentType: 'PEER_TO_PEER' | 'PAYMENT_SLIP',
};
