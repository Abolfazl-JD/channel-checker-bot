import { Markup } from "telegraf";
import { BotContext, UserState } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { consts } from "../../utils/consts";

export async function contactHandler(
  ctx: BotContext,
  bot: any,
  userState: Map<number, UserState>,
) {
  if (!ctx.message || !("contact" in ctx.message) || !ctx.from) return;

  const lang = consts.lang || "en";

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
