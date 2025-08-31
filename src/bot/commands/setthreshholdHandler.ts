import { consts } from "../../utils/consts";
import { BotContext } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { isAdmin } from "../helpers/isAdmin";

export async function setthreshholdHandler(ctx: BotContext) {
  if (!ctx.chat || !ctx.message || !("text" in ctx.message)) return;
  if (ctx.chat.type !== "private") return; // Skip if not a private chat

  const lang = consts.lang;

  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"));
    return;
  }

  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    await ctx.reply(i18n(lang, "invalidThreshold"));
    return;
  }

  const threshold = parseInt(args[1], 10);
  if (isNaN(threshold) || threshold < 0) {
    await ctx.reply(i18n(lang, "invalidThreshold"));
    return;
  }

  await db.setThreshold(threshold);
  await ctx.reply(i18n(lang, "thresholdSet", threshold));

  // Notify users
  try {
    const users = await db.getUsersWithTelegramId();
    for (const user of users) {
      await ctx.telegram.sendMessage(
        user.telegram_id,
        i18n(lang, "thresholdUpdate", threshold),
      );
    }
  } catch (error) {
    console.error(
      new Date().toString(),
      "Error sending message to users:",
      error,
    );
  }
}
