import { BotContext, UserState } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { consts } from "../../utils/consts";

export async function supportHandler(
  ctx: BotContext,
) {
  if (!ctx.message || !("text" in ctx.message) || !ctx.from) return;

  const lang = consts.lang;
  const supportId = await db.getSupportId()
  try {

    await ctx.reply(i18n(lang, "supportMessage",supportId));
  } catch (e) {
    console.log(e);
    await ctx.reply(i18n(lang, "error"));
  }

}
