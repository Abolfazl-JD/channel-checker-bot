import { Telegraf } from "telegraf";
import { BotContext } from "..";

export const createInviteLink = async (
  bot: Telegraf<BotContext>,
  groupId: string,
): Promise<string> => {
  const link = await bot.telegram.createChatInviteLink(groupId, {
    creates_join_request: false,
    expire_date: Math.floor(Date.now() / 1000) + 60, // 1 minutes
    member_limit: 1, // One-time use
  });

  return link.invite_link;
};
