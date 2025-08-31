import { Telegraf } from "telegraf";

export async function isChannelMember(
  bot: Telegraf<any>,
  telegramId: number | undefined,
) {
  if (!telegramId) return false;
  const channelId = process.env.CHANNEL_ID!;

  const member = await bot.telegram.getChatMember(channelId, telegramId);
  return member.status === "member";
}
