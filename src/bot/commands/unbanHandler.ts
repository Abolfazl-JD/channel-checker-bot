import { Telegraf } from "telegraf";
import { BotContext } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { isAdmin } from "../helpers/isAdmin";
import { mainMenuKeyboard } from "../../utils/main-menu-keyboard";

export async function unbanUserHandler(
  ctx: BotContext,
  bot: Telegraf<BotContext>,
) {
  if (!ctx.chat || !ctx.message || !("text" in ctx.message)) return;
  if (ctx.chat.type !== "private") return; // Only in private chat

  const admin = await db.getUserByTelegramId(ctx.from!.id);
  const lang = admin?.lang || "en";

  // Check admin
  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"), mainMenuKeyboard(lang));
    return;
  }

  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    await ctx.reply(i18n(lang, "invalidUsername"), mainMenuKeyboard(lang));
    return;
  }

  const username = String(args[1]);
  if (!username.startsWith("@")) {
    await ctx.reply(i18n(lang, "invalidUsername"), mainMenuKeyboard(lang));
    return;
  }

  const user = await db.getUserByUsername(username.substring(1));
  if (!user) {
    await ctx.reply(i18n(lang, "usernameNotFound"), mainMenuKeyboard(lang));
    return;
  }

  await db.markUserUnbanned(user.telegram_id);
  await bot.telegram.unbanChatMember(process.env.CHANNEL_ID!, user.telegram_id);

  await ctx.reply(i18n(lang, "userUnbanned", username), mainMenuKeyboard(lang));

  // Notify user
  try {
    await ctx.telegram.sendMessage(
      user.telegram_id,
      i18n(lang, "unbanAnnouncement"),
    );
  } catch (error) {
    console.error(
      new Date().toString(),
      `Error notifying user ${user.telegram_id}:`,
      error,
    );
  }
}
