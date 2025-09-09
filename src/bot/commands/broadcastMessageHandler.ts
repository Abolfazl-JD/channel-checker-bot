import { BotContext, UserState } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { mainMenuKeyboard } from "../../utils/main-menu-keyboard";

export async function broadcastMessageHandler(
  ctx: BotContext,
  userState: Map<number, UserState>,
) {
  if (!ctx.message || !("text" in ctx.message)) return;

  const user = await db.getUserByTelegramId(ctx.from!.id);
  const lang = user?.lang || "en";
  const messageText = ctx.message.text;

  try {
    const users = await db.getUsersWithTelegramId();

    for (const user of users) {
      try {
        await ctx.telegram.sendMessage(user.telegram_id, messageText);
      } catch (e) {
        console.log(`Failed to send message to ${user.telegram_id}:`, e);
      }
    }

    await ctx.reply(i18n(lang, "broadcastSent"), mainMenuKeyboard(lang));

    userState.delete(ctx.from!.id);
  } catch (e) {
    console.log(e);
    await ctx.reply(i18n(lang, "error"), mainMenuKeyboard(lang));
  }
}
