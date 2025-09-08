import { BotContext, UserState } from "..";
import { Markup } from "telegraf";

export async function setLangHandler(
  ctx: BotContext,
  userState: Map<number, UserState>,
  start: boolean = true,
) {
  if (!ctx.chat || !ctx.message || !("text" in ctx.message)) return;
  if (ctx.chat.type !== "private") return; // Skip if not a private chat

  // Send language selection message
  await ctx.reply(
    "🌐 لطفا زبان مورد نظر خود را انتخاب کنید:\n\n🌟 Please select your preferred language:",
    Markup.inlineKeyboard([
      [Markup.button.callback("🇮🇷 فارسی", "LANG_FA")],
      [Markup.button.callback("🇺🇸 English", "LANG_EN")],
    ]),
  );

  // Track state
  if (start) userState.set(ctx.from!.id, "AWAITING_START_LANGUAGE");
  else userState.set(ctx.from!.id, "AWAITING_UPDATE_LANGUAGE");
}
