import { Markup } from "telegraf";
import { BotContext, UserState } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";

export async function contactHandler(
  ctx: BotContext,
  userState: Map<number, UserState>,
) {
  if (!ctx.message || !("contact" in ctx.message) || !ctx.from) return;

  const user = await db.getUserByTelegramId(ctx.from.id);
  const lang = user?.lang || "en";

  try {
    const phone = ctx.message.contact.phone_number;

    db.updateUserPhone(ctx.from!.id, phone);
    ctx.user = await db.getUserByTelegramId(ctx.from!.id);
  } catch (error) {
    console.error(
      new Date().toString(),
      "Error processing contact input:",
      error,
    );
    await ctx.reply(i18n(lang, "error"));
  }
  await ctx.reply(
    i18n(lang, "askUid"),
    Markup.keyboard([[Markup.button.text(i18n(lang, "support"))]])
      .resize()
      .oneTime(),
  );
  userState.set(ctx.from!.id, "AWAITING_UID");
}
