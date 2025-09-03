import { Telegraf } from "telegraf";
import { BotContext } from "..";
import { i18n } from "../../locale";
import { isAdmin } from "../helpers/isAdmin";
import * as db from "../../database";
import { kickUserFromChannel } from "../helpers/kickUserFromChannel";

export async function banUserHandler(
  ctx: BotContext,
  bot: Telegraf<BotContext>,
) {
  if (!ctx.chat || !ctx.message || !("text" in ctx.message)) return;
  if (ctx.chat.type !== "private") return; // Skip if not a private chat

  const admin = await db.getUserByTelegramId(ctx.from!.id);
  const lang = admin?.lang || "en";

  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"));
    return;
  }

  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    await ctx.reply(i18n(lang, "invalidUsername"));
    return;
  }

  const username = String(args[1]);
  if (!username.startsWith("@")) {
    await ctx.reply(i18n(lang, "invalidUsername"));
    return;
  }

  const user = await db.getUserByUsername(username.substring(1));
  if (!user) {
    await ctx.reply(i18n(lang, "usernameNotFound"));
    return;
  }

  const result = await kickUserFromChannel(bot, user.telegram_id, true);
  if (result) {
    await db.markUserBanned(user.telegram_id);
    await ctx.reply(i18n(lang, "userBanned", username));

    //notify user
    try {
      await ctx.telegram.sendMessage(
        user?.telegram_id,
        i18n(lang, "banAnnouncement"),
      );
    } catch (error) {
      console.error(
        new Date().toString(),
        `Error notifying user ${user?.telegram_id}:`,
        error,
      );
    }
  }
}
