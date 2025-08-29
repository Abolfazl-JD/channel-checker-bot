import { TlbankBase } from "./lbankBase.type";

export type TlbankSuccess<T> = TlbankBase & {
  data: T;
};
