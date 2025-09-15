import { consts } from "../utils/consts";
import { TLbankUser } from "../utils/types/lbankUser.type";
import { sendRequest } from "../utils/sendRequest";
import { TlbankFailure } from "../utils/types/lbankFailure.type";
import { TlbankSuccess } from "../utils/types/lbankSuccess.type";

export type TGetTeamListRes = TLbankUser;

export async function getTeamList(
  start: number = 0,
  pageSize: number = 100,
): Promise<undefined | TlbankSuccess<TGetTeamListRes[]> | TlbankFailure> {
  const method = "GET";
  const endpoint = consts.endpoints.teamList;

  // Get the current time in milliseconds
  const currentTime = new Date().getTime(); // Current time in milliseconds since epoch

  // Set the required parameters
  const params = {
    startTime: 0,
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
