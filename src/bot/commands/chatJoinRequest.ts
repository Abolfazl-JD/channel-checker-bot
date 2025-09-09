import { BotContext } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";

export async function chatJoinRequest(ctx: BotContext) {
  const telegramId = ctx.from!.id;

  const user = await db.getUserByTelegramId(telegramId);
  const lang = user?.lang || "en";
  const threshold = await db.getThreshold();

  if (user && db.getTotalBalance(user) >= threshold) {
    await ctx.approveChatJoinRequest(telegramId);

    await ctx.telegram.sendMessage(telegramId, i18n(lang, "approved"));
    console.log(`Approved ${telegramId} to join the channel`);
  } else {
    await ctx.declineChatJoinRequest(telegramId);

    await ctx.telegram.sendMessage(telegramId, i18n(lang, "declined"));
    console.log(`Declined ${telegramId} to join the channel`);
  }
}
