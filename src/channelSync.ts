import { isChannelMember } from "./bot/helpers/isChannelMember";
import * as db from "./database";
import { Telegraf } from "telegraf";

// Check users membership in the channel
export async function syncChannelMembers(bot: Telegraf<any>) {
  try {
    console.log(new Date().toString(), "Syncing channel members...");

    const users = await db.getUsersWithTelegramId();
    for (const user of users) {
      try {
        const isNowJoined = await isChannelMember(bot, user.telegram_id);

        // Scenario 1: not joined before, now joined
        if (!user.joined && isNowJoined) {
          await db.markUserJoined(user.telegram_id);
          console.log(`User ${user.telegram_id} joined the channel.`);
        }

        // Scenario 2: joined before, now not joined
        else if (user.joined && !isNowJoined) {
          await db.markUserLeft(user.telegram_id);
          console.log(`User ${user.telegram_id} left the channel.`);
        }
      } catch (err: any) {
        console.error(
          new Date().toString(),
          `Error checking user ${user.telegram_id}:`,
          err?.description || err,
        );
      }
    }

    console.log(new Date().toString(), "Channel sync completed");
  } catch (error) {
    console.error(
      new Date().toString(),
      "Error syncing channel members:",
      error,
    );
  }
}

export function setupChannelSync(bot: Telegraf<any>) {
  // Interval from env or default 30 mins
  const interval =
    parseInt(process.env.SYNC_INTERVAL_MINUTES || "30", 10) * 60 * 1000;

  setInterval(() => {
    syncChannelMembers(bot).catch((err) =>
      console.error(
        new Date().toString(),
        "Error in scheduled channel sync:",
        err,
      ),
    );
  }, interval);

  // Run initial sync
  syncChannelMembers(bot).catch((err) =>
    console.error(new Date().toString(), "Error in initial channel sync:", err),
  );

  console.log(
    new Date().toString(),
    `Channel sync scheduled every ${interval / 60000} minutes`,
  );
}
