import path from "path";
import { Input } from "telegraf";
import { BotContext } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { consts } from "../../utils/consts";
import { mainMenuKeyboard } from "../../utils/main-menu-keyboard";

export async function uidTutorialHandler(ctx: BotContext) {
  if (!ctx.chat || !ctx.message || !("text" in ctx.message)) return;
  if (ctx.chat.type !== "private") return;

  const user = await db.getUserByTelegramId(ctx.from!.id);
  const lang = user?.lang || "en";

  const inviteCode = consts.inviteCode;

  const threshold = await db.getThreshold();

  const tutorialText = i18n(lang, "tutorialText", inviteCode, threshold);
  const imagePath = path.join(process.cwd(), "static/images/lbank_tut.jpg");

  try {
    await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
      caption: tutorialText.trim(),
      reply_markup: mainMenuKeyboard(lang).reply_markup,
    });
  } catch (error) {
    console.log(error);
    await ctx.reply(i18n(lang, "error"), mainMenuKeyboard(lang));
  }
}
