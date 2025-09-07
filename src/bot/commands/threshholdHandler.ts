import { BotContext } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { mainMenuKeyboard } from "../../utils/main-menu-keyboard";
import { isAdmin } from "../helpers/isAdmin";

export async function threshholdHandler(ctx: BotContext) {
  if (!ctx.chat) return;
  if (ctx.chat.type !== "private") return; // Skip if not a private chat

  const user = await db.getUserByTelegramId(ctx.from!.id);
  const lang = user?.lang || "en";

  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"), mainMenuKeyboard(lang));
    return;
  }

  const threshold = await db.getThreshold();
  await ctx.reply(
    i18n(lang, "currentThreshold", threshold),
    mainMenuKeyboard(lang),
  );
}
