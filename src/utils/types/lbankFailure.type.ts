import { TlbankBase } from "./lbankBase.type";

export type TlbankFailure = TlbankBase & {
  msg: string;
};
