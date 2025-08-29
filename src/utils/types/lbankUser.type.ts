export type TLbankUser = {
  id: number;
  openId: string;
  code: string;
  createTime: number;
  directInvitation: boolean;
  deposit: boolean;
  transaction: boolean;
  kycStatus: number;
  userLevel: number;
  currencyFeeAmt: string;
  contractFeeAmt: string;
  currencyTotalFeeAmt: string;
  contractTotalFeeAmt: string;
  reserveAmt: string;
};
