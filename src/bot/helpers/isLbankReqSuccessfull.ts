import { TlbankFailure } from "../../utils/types/lbankFailure.type";
import { TlbankSuccess } from "../../utils/types/lbankSuccess.type";

export function isLbankReqSuccessfull<T>(
  res: TlbankSuccess<T> | TlbankFailure,
): res is TlbankSuccess<T> {
  return res.result === "true";
}
