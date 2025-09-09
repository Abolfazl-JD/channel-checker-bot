import { BotContext, UserState } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { mainMenuKeyboard } from "../../utils/main-menu-keyboard";

export async function editVipInfoHandler(
  ctx: BotContext,
  userState: Map<number, UserState>,
  valueLang: "fa" | "en",
) {
  if (!ctx.message || !("text" in ctx.message) || !ctx.from) return;

  const user = await db.getUserByTelegramId(ctx.from.id);
  const lang = user?.lang || "en";

  const messageText = ctx.message.text;
  try {
    await db.setVipInfo(valueLang, messageText);

    if (userState.get(ctx.from!.id) === "AWAITING_VIP_INFO_FA") {
      await ctx.reply(i18n(lang, "vipInfoStepSavedFa"));

      userState.set(ctx.from!.id, "AWAITING_VIP_INFO_EN");
    } else {
      await ctx.reply(i18n(lang, "vipInfoUpdated"));

      userState.delete(ctx.from!.id);
    }
  } catch (e) {
    console.log(e);
    await ctx.reply(i18n(lang, "error"), mainMenuKeyboard(lang));
  }
}
