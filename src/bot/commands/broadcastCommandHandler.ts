import { BotContext, UserState } from "..";
import * as db from "../../database";
import { isAdmin } from "../helpers/isAdmin";
import { i18n } from "../../locale";
import { mainMenuKeyboard } from "../../utils/main-menu-keyboard";

export async function broadcastCommandHandler(
  ctx: BotContext,
  userState: Map<number, UserState>,
) {
  if (!ctx.chat || !ctx.message || !("text" in ctx.message)) return;
  if (ctx.chat.type !== "private") return;

  const user = await db.getUserByTelegramId(ctx.from!.id);
  const lang = user?.lang || "en";

  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"), mainMenuKeyboard(lang));
    return;
  }

  await ctx.reply(i18n(lang, "broadcastAskMessage"), mainMenuKeyboard(lang));

  userState.set(ctx.from!.id, "AWAITING_BROADCAST_MESSAGE");
}
