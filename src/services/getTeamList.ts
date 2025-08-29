import { consts } from "../utils/consts";
import { sendRequest } from "../utils/sendRequest";

export type TGetTeamListRes = {
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
export async function getTeamList(
  start: number = 0,
  pageSize: number = 100,
): Promise<
  | undefined
  | {
      result: "true" | "false";
      data: TGetTeamListRes[];
    }
> {
  const method = "GET";
  const endpoint = consts.endpoints.teamList;

  // Get the current time in milliseconds
  const currentTime = new Date().getTime(); // Current time in milliseconds since epoch

  // Set the required parameters
  const params = {
    startTime: currentTime - 12 * 30 * 24 * 60 * 60 * 1000,
    endTime: currentTime,
    start,
    pageSize,
  };
  let res = undefined;
  try {
    res = await sendRequest(endpoint, method, params);
  } catch (e) {
    console.log(new Date().toString(), e);
  }

  return res;
}
