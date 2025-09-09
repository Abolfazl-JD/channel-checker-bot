import { Telegraf } from "telegraf";
import { BotContext } from "..";

export const createInviteLink = async (
  bot: Telegraf<BotContext>,
  channelId: string,
): Promise<string> => {
  const link = await bot.telegram.createChatInviteLink(channelId, {
    creates_join_request: true,
    expire_date: Math.floor(Date.now() / 1000) + 60, // 1 minutes
  });

  return link.invite_link;
};
