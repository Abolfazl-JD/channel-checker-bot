import { BotContext, UserState } from "..";
import { i18n } from "../../locale";
import { consts } from "../../utils/consts";
import { isAdmin } from "../helpers/isAdmin";

export async function editWelcomeCommandHandler(
  ctx: BotContext,
  userState: Map<number, UserState>,
) {
  if (!ctx.chat || !ctx.message || !("text" in ctx.message)) return;
  if (ctx.chat.type !== "private") return; // Skip if not a private chat

  const lang = consts.lang;

  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"));
    return;
  }

  await ctx.reply(i18n(lang, "editWelcome"));
  userState.set(ctx.from!.id, "AWAITING_WELCOME");
}
