import { BotContext } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { mainMenuKeyboard } from "../../utils/main-menu-keyboard";

export async function vipInfoHandler(ctx: BotContext) {
  if (!ctx.chat || !ctx.message || !("text" in ctx.message)) return;
  if (ctx.chat.type !== "private") return;

  const user = await db.getUserByTelegramId(ctx.from!.id);
  const lang = user?.lang || "en";

  try {
    await ctx.reply(i18n(lang, "vipServices"), mainMenuKeyboard(lang));
  } catch (error) {
    console.log(error);
    await ctx.reply(i18n(lang, "error"), mainMenuKeyboard(lang));
  }
}
