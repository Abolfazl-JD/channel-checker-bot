import { consts } from "../../utils/consts";
import { BotContext } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { isAdmin } from "../helpers/isAdmin";

export async function threshholdHandler(ctx: BotContext) {
  if (!ctx.chat) return;
  if (ctx.chat.type !== "private") return; // Skip if not a private chat

  const lang = consts.lang;
  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"));
    return;
  }

  const threshold = await db.getThreshold();
  await ctx.reply(i18n(lang, "currentThreshold", threshold));
}
