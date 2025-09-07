import { BotContext, UserState } from "..";
import { i18n } from "../../locale";
import { isAdmin } from "../helpers/isAdmin";
import * as db from "../../database";
import { mainMenuKeyboard } from "../../utils/main-menu-keyboard";

export async function editWelcomeCommandHandler(
  ctx: BotContext,
  userState: Map<number, UserState>,
) {
  if (!ctx.chat || !ctx.message || !("text" in ctx.message)) return;
  if (ctx.chat.type !== "private") return; // Skip if not a private chat

  const user = await db.getUserByTelegramId(ctx.from!.id);
  const lang = user?.lang || "en";

  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"), mainMenuKeyboard(lang));
    return;
  }

  await ctx.reply(i18n(lang, "editWelcome"), mainMenuKeyboard(lang));
  userState.set(ctx.from!.id, "AWAITING_WELCOME");
}
