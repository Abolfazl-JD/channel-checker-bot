import { BotContext } from "..";
import * as db from "../../database";

export async function chatJoinRequest(ctx: BotContext) {
  const telegramId = ctx.from!.id;

  const user = await db.getUserByTelegramId(telegramId);
  const threshold = await db.getThreshold();

  if (user && db.getTotalBalance(user) >= threshold) {
    await ctx.approveChatJoinRequest(telegramId);
    console.log(`Approved ${telegramId} to join the channel`);
  } else {
    await ctx.declineChatJoinRequest(telegramId);
    console.log(`Declined ${telegramId} to join the channel`);
  }
}
