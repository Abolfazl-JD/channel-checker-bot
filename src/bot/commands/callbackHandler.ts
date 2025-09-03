import { Telegraf } from "telegraf";
import { BotContext, UserState } from "..";
import * as db from "../../database";
import { startHandler } from "./startHandler";

export const callbackHandler = async (
  ctx: BotContext,
  bot: Telegraf<BotContext>,
  userState: Map<number, UserState>,
) => {
  const telegramId = ctx.from!.id;

  if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
    const lang = ctx.callbackQuery.data;
    console.log(`user ${telegramId} set language to ${lang}`);

    if (lang === "LANG_FA") {
      await ctx.answerCbQuery("زبان فارسی انتخاب شد ✅");
      await db.updateUserLanguage(telegramId, "fa");
      await ctx.editMessageText("🇮🇷 زبان شما به فارسی تغییر یافت.");
    } else if (lang === "LANG_EN") {
      await ctx.answerCbQuery("English language selected ✅");
      await db.updateUserLanguage(telegramId, "en");
      await ctx.editMessageText("🇺🇸 Your language has been set to English.");
    }

    userState.delete(telegramId);
    await startHandler(ctx, bot, userState);
  } else {
    console.error("callback query has no data");
  }
};
