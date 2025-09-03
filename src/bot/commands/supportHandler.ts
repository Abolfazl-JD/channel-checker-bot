import { BotContext } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";

export async function supportHandler(ctx: BotContext) {
  if (!ctx.message || !("text" in ctx.message) || !ctx.from) return;

  const user = await db.getUserByTelegramId(ctx.from.id);
  const lang = user?.lang || "en";

  const supportId = await db.getSupportId();
  try {
    await ctx.reply(i18n(lang, "supportMessage", supportId));
  } catch (e) {
    console.log(e);
    await ctx.reply(i18n(lang, "error"));
  }
}
