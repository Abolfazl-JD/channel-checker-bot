import { Telegraf } from "telegraf";
import { BotContext } from "..";

export async function kickUserFromChannel(
  bot: Telegraf<BotContext>,
  userId: number,
  ban: boolean = false,
): Promise<boolean> {
  try {
    await bot.telegram.banChatMember(
      process.env.CHANNEL_ID!,
      userId,
      Math.floor(Date.now() / 1000) + 60, // Ban for 1 minute
    );

    if (!ban) {
      // Immediately unban to allow rejoining in the future
      await bot.telegram.unbanChatMember(process.env.CHANNEL_ID!, userId);
    }
    return true;
  } catch (error) {
    console.error(
      new Date().toString(),
      `Error kicking user ${userId}:`,
      error,
    );
    return false;
  }
}
