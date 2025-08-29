import { consts } from "../../utils/consts";
import { BotContext } from "..";
import { i18n } from "../../locale";
import { isAdmin } from "../helpers/isAdmin";

export async function helpHandler(ctx: BotContext) {
  if (!ctx.chat) return;
  if (ctx.chat.type !== "private") return; // Skip if not a private chat

  const lang = consts.lang;
  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"));
    return;
  }

  await ctx.reply(i18n(lang, "help"));
}
