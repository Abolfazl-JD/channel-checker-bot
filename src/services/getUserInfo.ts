import { TLbankUser } from "../utils/types/lbankUser.type";
import { TlbankFailure } from "../utils/types/lbankFailure.type";
import { TlbankSuccess } from "../utils/types/lbankSuccess.type";
import { consts } from "../utils/consts";
import { sendRequest } from "../utils/sendRequest";

export type TGetUserInfo = TLbankUser & {
  inviteResult: boolean;
};

export async function getUserInfo(
  openId: string,
): Promise<undefined | TlbankSuccess<TGetUserInfo> | TlbankFailure> {
  const method = "GET";
  const endpoint = consts.endpoints.userInfo;

  const params = {
    openId,
  };

  let res = undefined;
  try {
    res = await sendRequest(endpoint, method, params);
  } catch (e) {
    console.log(new Date().toString(), e);
  }

  return res;
}
