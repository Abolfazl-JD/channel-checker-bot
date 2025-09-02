import { consts } from "../../utils/consts";
import { BotContext, UserState } from "..";
import * as db from "../../database";
import { i18n } from "../../locale";
import { createInviteLink } from "../helpers/createInviteLink";
import { Markup } from "telegraf";
import { isChannelMember } from "../helpers/isChannelMember";

export async function startHandler(
  ctx: BotContext,
  bot: any,
  userState: Map<number, UserState>,
) {
  if (!ctx.chat || !ctx.message || !("text" in ctx.message)) return;
  if (ctx.chat.type !== "private") return; // Skip if not a private chat

  const lang = consts.lang;

  const user = await db.getUserByTelegramId(ctx.from!.id);
  if (user?.is_banned) {
    await ctx.reply(i18n(lang, "banAnnouncement"));
    return;
  }

  const welcomeMessage = await db.getWelcomeMessage();
  await ctx.reply(welcomeMessage || i18n(lang, "greeting"));

  const isUserJoined = await isChannelMember(bot, user?.telegram_id);

  if (!user?.uid) {
    ctx.reply(
      i18n(lang, "askContact"),
      Markup.keyboard([
        [Markup.button.contactRequest(i18n(lang, "shareContact"))],
        [Markup.button.text(i18n(lang, "support"))],
      ])
        .resize()
        .oneTime(),
    );
    userState.set(ctx.from!.id, "AWAITING_CONTACT");
  } else if (isUserJoined) {
    await ctx.reply(
      i18n(lang, "alreadyJoined"),
      Markup.keyboard([[Markup.button.text(i18n(lang, "support"))]])
        .resize()
        .oneTime(),
    );
  } else {
    const threshold = await db.getThreshold();
    if (db.getTotalBalance(ctx.user) >= threshold) {
      const link = await createInviteLink(bot, process.env.CHANNEL_ID!);
      await ctx.reply(
        i18n(lang, "inviteSent", link),
        Markup.keyboard([[Markup.button.text(i18n(lang, "support"))]])
          .resize()
          .oneTime(),
      );
      // await ctx.reply(link);
    } else {
      await ctx.reply(
        i18n(lang, "belowThreshold", threshold, db.getTotalBalance(ctx.user)),
        Markup.keyboard([[Markup.button.text(i18n(lang, "support"))]])
          .resize()
          .oneTime(),
      );
    }
  }
}
