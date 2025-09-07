import { BotContext, UserState } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { mainMenuKeyboard } from "../../utils/main-menu-keyboard";

export async function editWelcomeHandler(
  ctx: BotContext,
  userState: Map<number, UserState>,
) {
  if (!ctx.message || !("text" in ctx.message) || !ctx.from) return;

  const user = await db.getUserByTelegramId(ctx.from.id);
  const lang = user?.lang || "en";

  const messageText = ctx.message.text;
  try {
    await db.setWelcomeMessage(messageText);

    await ctx.reply(i18n(lang, "editSuccess"), mainMenuKeyboard(lang));
  } catch (e) {
    console.log(e);
    await ctx.reply(i18n(lang, "error"), mainMenuKeyboard(lang));
  }

  userState.delete(ctx.from!.id);
}
