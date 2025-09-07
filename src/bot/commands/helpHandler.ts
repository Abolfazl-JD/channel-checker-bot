import * as db from "../../database";
import { BotContext } from "..";
import { i18n } from "../../locale";
import { isAdmin } from "../helpers/isAdmin";
import { mainMenuKeyboard } from "../../utils/main-menu-keyboard";

export async function helpHandler(ctx: BotContext) {
  if (!ctx.chat) return;
  if (ctx.chat.type !== "private") return; // Skip if not a private chat

  const user = await db.getUserByTelegramId(ctx.from!.id);
  const lang = user?.lang || "en";

  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"), mainMenuKeyboard(lang));
    return;
  }

  await ctx.reply(i18n(lang, "help"), mainMenuKeyboard(lang));
}
