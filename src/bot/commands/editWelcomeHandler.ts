import { BotContext, UserState } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { consts } from "../../utils/consts";

export async function editWelcomeHandler(
  ctx: BotContext,
  userState: Map<number, UserState>,
) {
  if (!ctx.message || !("text" in ctx.message) || !ctx.from) return;

  const lang = consts.lang;
  const messageText = ctx.message.text;
  try {
    await db.setWelcomeMessage(messageText);

    await ctx.reply(i18n(lang, "editSuccess"));
  } catch (e) {
    console.log(e);
    await ctx.reply(i18n(lang, "error"));
  }

  userState.delete(ctx.from!.id);
}
