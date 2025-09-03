import { BotContext } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { isAdmin } from "../helpers/isAdmin";

export async function setSupportHandler(ctx: BotContext) {
  if (!ctx.chat || !ctx.message || !("text" in ctx.message)) return;
  if (ctx.chat.type !== "private") return; // Skip if not a private chat

  const user = await db.getUserByTelegramId(ctx.from!.id);
  const lang = user?.lang || "en";

  if (!isAdmin(ctx)) {
    await ctx.reply(i18n(lang, "adminOnly"));
    return;
  }

  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    await ctx.reply(i18n(lang, "invalidSupport"));
    return;
  }

  const support = args[1];

  await db.setSupportId(support);
  await ctx.reply(i18n(lang, "supportSet", support));
}
