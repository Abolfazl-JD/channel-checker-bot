import { Telegraf } from "telegraf";
import { BotContext, UserState } from "..";
import * as db from "../../database";
import { startHandler } from "./startHandler";
import { i18n } from "../../locale";
import { mainMenuKeyboard } from "../../utils/main-menu-keyboard";

export const callbackHandler = async (
  ctx: BotContext,
  bot: Telegraf<BotContext>,
  userState: Map<number, UserState>,
) => {
  const telegramId = ctx.from!.id;

  if (
    userState.get(telegramId) !== "AWAITING_START_LANGUAGE" &&
    userState.get(telegramId) !== "AWAITING_UPDATE_LANGUAGE"
  )
    return;

  if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
    const lang = ctx.callbackQuery.data === "LANG_FA" ? "fa" : "en";
    console.log(`user ${telegramId} set language to ${lang}`);

    if (lang === "fa") {
      await ctx.answerCbQuery("زبان فارسی انتخاب شد ✅");
      await db.updateUserLanguage(telegramId, lang);
      await ctx.editMessageText("🇮🇷 زبان شما به فارسی تغییر یافت.");
    } else if (lang === "en") {
      await ctx.answerCbQuery("English language selected ✅");
      await db.updateUserLanguage(telegramId, lang);
      await ctx.editMessageText("🇺🇸 Your language has been set to English.");
    }

    userState.delete(telegramId);

    if (userState.get(telegramId) === "AWAITING_START_LANGUAGE") {
      await ctx.reply(i18n(lang, "greeting"), mainMenuKeyboard(lang));
      await startHandler(ctx, bot, userState);
    }
  } else {
    console.error("callback query has no data");
  }
};
